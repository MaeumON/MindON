import { Session } from "openvidu-browser";
import { QuestionChangedData, QuestionSpeakingOrderType } from "../openviduTypes";
import { useQuestionStore } from "@/stores/questionStore";
// import { startInitialTimer } from "./timer";

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
      setCurrentQuestionText("잠시 후 질문이 시작됩니다.");

      return;
    }

    //질문 시작 전
    if (isMeetingStart === 1 && isQuestionStart === 0) {
      setIsQuestionStart(1);
      setCurrentQuestionText(questions[0].detail);
      setCurrentUser(0);
      setCurrentUserId(speakingOrder[0].userId);
      return;
    }

    //질문 중
    if (isMeetingStart === 1 && isQuestionStart === 1) {
      //질문 완전 종료
      if (currentQuestionNumber === questions.length - 1) {
        setCurrentQuestionText("모임이 종료되었습니다.");
        setIsQuestionStart(2);
        return;
      }

      //답변 시작
      if (currentUserId === userId && !isSpeaking) {
        setIsSpeaking(true);
        return;
      } else if (currentUserId === userId && isSpeaking) {
        setIsSpeaking(false);
        setCurrentUser(currentUser + 1);
        setCurrentUserId(speakingOrder[currentUser + 1].userId);
        return;
      }

      //하나의 질문 종료
      if (currentUser === speakingOrder.length - 1) {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
        setCurrentUser(0);
        setCurrentQuestionText(questions[currentQuestionNumber + 1].detail);
      } else {
        setCurrentUser(currentUser + 1);
        setCurrentUserId(speakingOrder[currentUser + 1].userId);
      }
    }
  });
}

//모임 바로 시작하기 버튼 누르면 모임 시작 시그널 보내기
export function sendSignalStartMeeting({ data, session }: { data: QuestionSpeakingOrderType[]; session: Session }) {
  const signalOptions = {
    data: JSON.stringify(data),
    type: "startMeeting",
  };
  session?.signal(signalOptions);
}

export function subscribeToStartMeeting({ session }: { session: Session }) {
  session.on("signal:startMeeting", async (event) => {
    // 매번 최신 store 상태를 가져오도록 수정
    const store = useQuestionStore.getState();
    const {
      isMeetingStart,
      setIsMeetingStart,
      setIsQuestionStart,
      setCurrentQuestionText,
      questions,
      setCurrentUser,
      setCurrentUserId,
    } = store;

    const data = JSON.parse(event.data || "");

    // 미팅이 시작되지 않은 상태일 때만 실행
    if (isMeetingStart === 0) {
      setIsMeetingStart(1);
      setCurrentQuestionText("5초 후에 질문이 시작됩니다.");

      // 5초 타이머 시작
      // await startInitialTimer();

      // 5초 후 질문 시작 전 상태로 변경
      setIsQuestionStart(1);
      setCurrentQuestionText(questions[0].detail);
      setCurrentUser(0);
      setCurrentUserId(data.speakingOrder[0].userId);
    }
  });
}
