import { Session } from "openvidu-browser";
import { QuestionChangedData } from "../openviduTypes";
import { useQuestionStore } from "@/stores/questionStore";

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

    console.log("data", data);
    const speakingOrder = data.speakingOrder;
    const userId = data.userId;

    console.log("isMeetingStart", isMeetingStart);
    console.log("isQuestionStart", isQuestionStart);
    console.log("currentQuestionNumber", currentQuestionNumber);
    console.log("currentUser", currentUser);

    //질문 교체
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

    console.log("--------------------------------");
    console.log("isMeetingStart", isMeetingStart);
    console.log("isQuestionStart", isQuestionStart);
    console.log("currentQuestionNumber", currentQuestionNumber);
    console.log("currentUser", currentUser);
  });
}
