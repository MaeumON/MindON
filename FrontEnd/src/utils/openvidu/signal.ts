import { Session } from "openvidu-browser";
import { QuestionChangedData } from "./openviduTypes";
import { useQuestionStore } from "@/stores/questionStore";
import { startInitialTimer } from "./timer";
import { startRecording, stopRecording } from "@/apis/openvidu/recordingApi";

//질문 시작 시, 참가자 리스트 보내는 시그널
export function sendSignalQuestionChanged({ data, session }: { data: QuestionChangedData; session: Session }) {
  const signalOptions = {
    data: JSON.stringify(data),
    type: "questionChanged",
  };
  session?.signal(signalOptions);
}

export function subscribeToQuestionChanged({ session }: { session: Session }) {
  session.on("signal:questionChanged", (event) => {
    const store = useQuestionStore.getState();
    const {
      questions,
      speakingOrder,
      isMeetingStart,
      isQuestionStart,
      currentQuestionNumber,
      currentUser,
      currentUserId,
      isSpeaking,
      totalAnswerPerQuestion,
      setIsQuestionStart,
      setCurrentQuestionNumber,
      setCurrentQuestionId,
      setCurrentUser,
      setCurrentUserId,
      setCurrentQuestionText,
      setIsSpeaking,
      setTotalAnswerPerQuestion,
      setSpeakingOrder,
    } = store;

    const data = JSON.parse(event.data || "");
    const userId = data.userId;

    if (speakingOrder.length === 0) {
      alert("발언자 순서를 받아오는데 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSpeakingOrder(speakingOrder);

    console.log("question changed 실행", speakingOrder);

    console.log("--- 버튼 조작됨 ---");
    console.log("-- 질문 리스트 --", questions);
    console.log("-- 발언자 순서 --", speakingOrder);

    if (isMeetingStart === 0) {
      return;
    }

    //질문 중
    if (isMeetingStart === 1 && isQuestionStart === 1) {
      //답변 시작
      if (currentUserId === userId && !isSpeaking) {
        setIsSpeaking(true);
        //녹음 시작 API 호출
        startRecording({ sessionID: session.sessionId })
          .then(() => console.log("녹음 시작 성공"))
          .catch((error) => {
            console.log("녹음 시작 실패", error);
          });

        return;
      } else if (currentUserId === userId && isSpeaking) {
        setIsSpeaking(false);
        //녹음 종료 API 호출
        stopRecording({ sessionID: session.sessionId, questionId: questions[currentQuestionNumber].questionId })
          .then(() => console.log("녹음 종료 성공"))
          .catch((error) => {
            console.log("녹음 종료 실패", error);
          });

        //답변이 끝나면 질문 바꾸는 로직 진행
        setTotalAnswerPerQuestion(totalAnswerPerQuestion + 1);

        // 마지막 질문의 마지막 사용자인 경우 모임 종료
        if (currentQuestionNumber === questions.length - 1 && currentUser === speakingOrder.length - 1) {
          setCurrentQuestionText("모임이\n종료되었습니다.");
          setIsQuestionStart(2);
          return;
        }

        //하나의 질문 종료
        if (totalAnswerPerQuestion === speakingOrder.length - 1) {
          // 다음 질문 번호를 직접 계산
          const nextQuestionNumber = currentQuestionNumber + 1;
          const nextQuestionId = questions[nextQuestionNumber].questionId;

          setCurrentUser(0);
          setCurrentUserId(speakingOrder[0].userId);
          setCurrentQuestionNumber(nextQuestionNumber);
          setCurrentQuestionId(nextQuestionId);
          setCurrentQuestionText(`Q${nextQuestionNumber + 1}.\n${questions[nextQuestionNumber].detail}`);
          setTotalAnswerPerQuestion(0);
        } else {
          const nextUser = (currentUser + 1) % speakingOrder.length;

          setCurrentUser(nextUser);
          setCurrentUserId(speakingOrder[nextUser].userId);
          setTotalAnswerPerQuestion(totalAnswerPerQuestion + 1);
        }
      }
    }
  });
}

//모임 바로 시작하기 버튼 누르면 모임 시작 시그널 보내기
export function sendSignalStartMeeting({ session }: { session: Session }) {
  const signalOptions = {
    type: "startMeeting",
  };
  session?.signal(signalOptions);
}

export function subscribeToStartMeeting({ session }: { session: Session }) {
  session.on("signal:startMeeting", async () => {
    try {
      const store = useQuestionStore.getState();
      const {
        questions,
        speakingOrder,
        isMeetingStart,
        setIsMeetingStart,
        setCurrentUser,
        setCurrentQuestionNumber,
        setCurrentQuestionId,
        setCurrentUserId,
        setIsQuestionStart,
        setCurrentQuestionText,
        setSpeakingOrder,
      } = store;

      console.log("startMeeting 실행", speakingOrder);

      if (!speakingOrder || speakingOrder.length === 0) {
        alert("발언자 순서를 받아오는데 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      setSpeakingOrder(speakingOrder);

      if (isMeetingStart === 0) {
        setIsMeetingStart(1);
        setIsQuestionStart(0);

        await startInitialTimer();

        setIsQuestionStart(1);
        setCurrentUser(0);
        setCurrentUserId(speakingOrder[0].userId);
        setCurrentQuestionNumber(0);
        setCurrentQuestionId(questions[0].questionId);
        setCurrentQuestionText(`Q1.\n${questions[0].detail}`);
      }
    } catch (error) {
      console.error("Error in subscribeToStartMeeting:", error);
    }
  });
}
