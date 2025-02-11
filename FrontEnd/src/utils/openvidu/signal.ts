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
      setIsMeetingStart,
      setIsQuestionStart,
      setCurrentQuestionNumber,
      setCurrentUser,
      setCurrentUserId,
      setCurrentQuestionText,
      setIsSpeaking,
    } = store;

    const data = JSON.parse(event.data || "");

    const speakingOrder = data.speakingOrder;
    const userId = data.userId;

    //미팅 시작 전
    if (isMeetingStart === 0) {
      setIsMeetingStart(1);
      setIsQuestionStart(0);
      setCurrentQuestionText("잠시 후,\n질문이 시작됩니다.");

      return;
    }

    //질문 중
    if (isMeetingStart === 1 && isQuestionStart === 1) {
      //질문 완전 종료
      if (currentQuestionNumber === questions.length - 1 && currentUser === speakingOrder.length - 1) {
        setCurrentQuestionText("모임이\n종료되었습니다.");
        setIsQuestionStart(2);
        return;
      }

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

        const nextUser = (currentUser + 1) % speakingOrder.length;
        setCurrentUser(nextUser);
        setCurrentUserId(speakingOrder[nextUser].userId);
        return;
      }

      //하나의 질문 종료
      if (currentUser === speakingOrder.length - 1) {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
        setCurrentUser(0);
        setCurrentUserId(speakingOrder[0].userId);
        setCurrentQuestionText(`Q${currentQuestionNumber + 1}.\n${questions[currentQuestionNumber + 1].detail}`);
      } else {
        const nextUser = (currentUser + 1) % speakingOrder.length;
        setCurrentUser(nextUser);
        setCurrentUserId(speakingOrder[nextUser].userId);
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
        currentQuestionNumber,
        setCurrentUser,
        setCurrentQuestionNumber,
        setCurrentUserId,
        setIsQuestionStart,
        setCurrentQuestionText,
      } = store;

      const data = JSON.parse(event.data || "");
      const speakingOrder = data.speakingOrder;

      console.log("startMeeting signal subscribe", event);
      console.log("speakingOrder", speakingOrder);

      if (isMeetingStart === 0) {
        await startInitialTimer();
        setIsQuestionStart(1);
        setCurrentQuestionText(`Q1.\n${questions[0].detail}`);
        setCurrentUser(0);
        setCurrentUserId(speakingOrder[0].userId);
        setCurrentQuestionNumber(1);
        console.log("States updated, currentQuestionNumber:", currentQuestionNumber);
      }
    } catch (error) {
      console.error("Error in subscribeToStartMeeting:", error);
    }
  });
}
