import { Session } from "openvidu-browser";
import { QuestionChangedData, QuestionSpeakingOrderType } from "../openviduTypes";
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
    // 매번 최신 store 상태를 가져오도록 수정
    const store = useQuestionStore.getState();
    const {
      questions,
      isMeetingStart,
      isQuestionStart,
      currentQuestionNumber,
      currentUser,
      currentUserId,
      isSpeaking,
      totalAnswerPerQuestion,
      setIsMeetingStart,
      setIsQuestionStart,
      setCurrentQuestionNumber,
      setCurrentQuestionId,
      setCurrentUser,
      setCurrentUserId,
      setCurrentQuestionText,
      setIsSpeaking,
      setTotalAnswerPerQuestion,
    } = store;

    const data = JSON.parse(event.data || "");

    const speakingOrder = data.speakingOrder;
    const userId = data.userId;

    console.log("--- 버튼 조작됨 ---");
    console.log("-- 질문 리스트 --", questions);
    console.log("-- 발언자 순서 --", speakingOrder);
    //미팅 시작 전
    if (isMeetingStart === 0) {
      setIsMeetingStart(1);
      setIsQuestionStart(0);
      setCurrentQuestionText("잠시 후,\n질문이 시작됩니다.");

      return;
    }

    //질문 중
    if (isMeetingStart === 1 && isQuestionStart === 1) {
      console.log("--- 질문 중 ---");

      console.log("!! currentQuestionNumber", currentQuestionNumber);
      console.log("!! currentUser", currentUser);

      console.log("!! questions.length", questions.length);
      console.log("!! speakingOrder.length", speakingOrder.length);
      //질문 완전 종료
      if (currentQuestionNumber === questions.length - 1 && currentUser === speakingOrder.length - 1) {
        console.log("질문 완전 종료");
        setCurrentQuestionText("모임이\n종료되었습니다.");
        setIsQuestionStart(2);
        return;
      }

      //답변 시작
      console.log("!! currentUserId", currentUserId);
      console.log("!! userId", userId);
      console.log("!! isSpeaking", isSpeaking);
      if (currentUserId === userId && !isSpeaking) {
        console.log("답변 시작");
        setIsSpeaking(true);
        //녹음 시작 API 호출
        startRecording({ sessionID: session.sessionId })
          .then(() => console.log("녹음 시작 성공"))
          .catch((error) => {
            console.log("녹음 시작 실패", error);
          });

        return;
      } else if (currentUserId === userId && isSpeaking) {
        console.log("답변 중단");
        setIsSpeaking(false);
        //녹음 종료 API 호출
        stopRecording({ sessionID: session.sessionId, questionId: questions[currentQuestionNumber].questionId })
          .then(() => console.log("녹음 종료 성공"))
          .catch((error) => {
            console.log("녹음 종료 실패", error);
          });

        //답변이 끝나면 질문 바꾸는 로직 진행
        setTotalAnswerPerQuestion(totalAnswerPerQuestion + 1);

        //하나의 질문 종료
        if (totalAnswerPerQuestion === speakingOrder.length - 1) {
          console.log("하나의 질문이 종료됨");

          // 다음 질문 번호를 직접 계산
          const nextQuestionNumber = currentQuestionNumber + 1;
          const nextQuestionId = questions[nextQuestionNumber].questionId;

          console.log("다음 질문 인덱스", nextQuestionNumber);
          console.log("다음 질문 아이디", nextQuestionId);

          setCurrentUser(0);
          setCurrentUserId(speakingOrder[0].userId);
          setCurrentQuestionNumber(nextQuestionNumber);
          setCurrentQuestionId(nextQuestionId);
          setCurrentQuestionText(`Q${nextQuestionNumber + 1}.\n${questions[nextQuestionNumber].detail}`);
          setTotalAnswerPerQuestion(0);
        } else {
          console.log("아직 질문이 종료되지 않음");

          const nextUser = (currentUser + 1) % speakingOrder.length;
          console.log("다음 발언자 인덱스", nextUser);
          console.log("다음 발언자 아이디", speakingOrder[nextUser].userId);

          setCurrentUser(nextUser);
          setCurrentUserId(speakingOrder[nextUser].userId);
          setTotalAnswerPerQuestion(totalAnswerPerQuestion + 1);
        }
      }
    }
  });
}

//모임 바로 시작하기 버튼 누르면 모임 시작 시그널 보내기
export function sendSignalStartMeeting({
  data,
  session,
}: {
  data: { speakingOrder: QuestionSpeakingOrderType[] };
  session: Session;
}) {
  const signalOptions = {
    data: JSON.stringify(data),
    type: "startMeeting",
  };
  session?.signal(signalOptions);
}

export function subscribeToStartMeeting({ session }: { session: Session }) {
  session.on("signal:startMeeting", async (event) => {
    try {
      const store = useQuestionStore.getState();
      const {
        questions,
        isMeetingStart,
        setCurrentUser,
        setCurrentQuestionNumber,
        setCurrentQuestionId,
        setCurrentUserId,
        setIsQuestionStart,
        setCurrentQuestionText,
      } = store;

      const data = JSON.parse(event.data || "");
      const speakingOrder = data.speakingOrder;

      if (isMeetingStart === 0) {
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
