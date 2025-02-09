import { fetchQuestionSpeakingOrder } from "@/apis/openvidu/questionApi";
import { PARTICIPANT_LIST } from "@/data/OPENVIDU";
// import useAuthStore from "@/stores/authStore";
import { useQuestionStore } from "@/stores/questionStore";
import { sendSignalQuestionChanged, subscribeToQuestionChanged } from "@/utils/openvidu/signal";
import { QuestionChangedData, QuestionSpeakingOrderType, UserModelType } from "@/utils/openviduTypes";
import { Session } from "openvidu-browser";
import { useEffect, useState } from "react";

interface QuestionProps {
  session: Session;
  mySessionId: string;
  subscribers: UserModelType[];
}

const userId = "4";

const Question = ({ session, mySessionId }: QuestionProps) => {
  const {
    isMeetingStart,
    isQuestionStart,
    currentUser,
    currentQuestionText,
    currentBtnText,
    isSpeaking,
    currentUserId,
    fetchQuestionsData,
    setCurrentQuestionText,
    setCurrentBtnText,
  } = useQuestionStore();

  //추후 로그인 기능과 연동 시, 사용
  // const { data } = useAuthStore();
  // const userId = data?.userId;

  const [speakingOrder, setSpeakingOrder] = useState<QuestionSpeakingOrderType[]>([]);

  function stateChanger() {
    const signalData: QuestionChangedData = { userId: userId, speakingOrder: speakingOrder };
    sendSignalQuestionChanged({ data: signalData, session });
  }

  const getButtonText = () => {
    if (isMeetingStart === 0) {
      return "모임 바로 시작하기";
    }

    if (isMeetingStart === 1 && isQuestionStart === 0) {
      return "질문 시작하기";
    }

    if (isQuestionStart === 2) {
      return "모임이 종료되었습니다.";
    }

    if (isMeetingStart === 1 && isQuestionStart === 1) {
      if (currentUserId === userId && !isSpeaking) {
        return "답변 시작하기";
      } else if (currentUserId === userId && isSpeaking) {
        return "답변 중단하기";
      }

      return `${speakingOrder[currentUser].userName}님이 발언 중이에요`;
    }
    return currentBtnText;
  };

  const fetchOrder = async () => {
    const response = await fetchQuestionSpeakingOrder({ groupId: mySessionId, participants: PARTICIPANT_LIST });

    const sortedResponse = response.sort((a, b) => a.no - b.no);
    setSpeakingOrder(sortedResponse);
  };

  useEffect(() => {
    //질문 받아와서 전역에 설정
    fetchQuestionsData(mySessionId);

    //질문 발언 순서 받아오기
    fetchOrder();

    setCurrentQuestionText("잠시 후, 모임이 시작됩니다.");
    setCurrentBtnText("모임 바로 시작하기");

    // questionStore를 인자로 전달
    subscribeToQuestionChanged({
      session,
    });
  }, []);

  return (
    <div className="p-2 w-full h-[180px] flex flex-col justify-center bg-white rounded-[12px]">
      <div className="m-2 p-4 rounded-[12px] font-bold text-24px bg-offWhite">{currentQuestionText}</div>

      <div className="m-2 p-2 text-center">
        <button
          disabled={isQuestionStart === 2}
          onClick={stateChanger}
          className={`p-2 rounded-[12px] font-bold text-18px text-white
        ${
          isQuestionStart === 2
            ? "bg-cardContent2"
            : isMeetingStart === 1 && isQuestionStart === 1 && currentUserId !== userId
              ? "bg-cardContent2"
              : isSpeaking
                ? "bg-red100"
                : "bg-green100"
        } disabled:bg-cardContent2`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default Question;
