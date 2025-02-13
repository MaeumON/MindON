import { Session } from "openvidu-browser";
import { useEffect, useState } from "react";
import { fetchQuestionSpeakingOrder } from "@apis/openvidu/questionApi";
import useAuthStore from "@stores/authStore";
import { useQuestionStore } from "@stores/questionStore";
import {
  sendSignalQuestionChanged,
  sendSignalStartMeeting,
  subscribeToQuestionChanged,
  subscribeToStartMeeting,
} from "@utils/openvidu/signal";
import { QuestionChangedData, QuestionSpeakingOrderType } from "@/utils/openvidu/openviduTypes";
import IntroBear from "@assets/images/bear/introbear.png";
import SpeakerModal from "../SpeakerModal";
import SpeakerBubble from "@assets/images/SpeakerBubble.png";

interface QuestionProps {
  meetingId: number;
  session: Session;
  mySessionId: string;
}

const Question = ({ meetingId, session, mySessionId }: QuestionProps) => {
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
    remainingTime,
  } = useQuestionStore();

  //추후 로그인 기능과 연동 시, 사용
  const { userId } = useAuthStore();
  const [speakingOrder, setSpeakingOrder] = useState<QuestionSpeakingOrderType[]>([]);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState<boolean>(false);

  function stateChanger() {
    const signalData: QuestionChangedData = { userId: userId, speakingOrder: speakingOrder };
    if (isMeetingStart === 0) {
      sendSignalStartMeeting({ data: { speakingOrder: speakingOrder }, session });
    }
    sendSignalQuestionChanged({ data: signalData, session });
  }

  function getButtonText() {
    if (isMeetingStart === 0) {
      return "모임 바로 시작하기";
    }

    if (isMeetingStart === 1 && isQuestionStart === 0) {
      return remainingTime > 0 ? `${remainingTime}초` : "5초 뒤에 시작합니다.";
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
  }

  const fetchOrder = async () => {
    const response = await fetchQuestionSpeakingOrder({ groupId: mySessionId });

    const sortedResponse = response.sort((a, b) => a.no - b.no);
    setSpeakingOrder(sortedResponse);
    console.log("speakingOrder", speakingOrder);
  };

  function showSpeakerModal() {
    setIsSpeakerModalOpen(true);
  }

  useEffect(() => {
    //질문 받아와서 전역에 설정
    console.log("meetingId", meetingId);

    fetchQuestionsData(meetingId).then(() => fetchOrder());

    setCurrentQuestionText(`잠시 후,\n모임이 시작됩니다.`);
    setCurrentBtnText("모임 바로 시작하기");

    subscribeToQuestionChanged({
      session,
    });
    subscribeToStartMeeting({ session });
  }, []);

  useEffect(() => {
    if (isMeetingStart === 1 && isQuestionStart === 1 && currentUserId !== userId) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [isMeetingStart, isQuestionStart, currentUserId, userId]);

  return (
    <div className="p-2 mb-[10px] w-full max-h-[300px] flex flex-col justify-center items-center bg-white rounded-[12px] gap-[15px]">
      <div className="relative mt-[5px] p-4 w-[95%] h-[130px] flex rounded-[12px] font-bold text-24px bg-offWhite">
        <div className="w-[70%] whitespace-pre-wrap">{currentQuestionText}</div>
        <img
          src={IntroBear}
          onClick={showSpeakerModal}
          alt="온이"
          className=" absolute bottom-0 right-4 w-[85px] hover:cursor-pointer"
        />
        <img src={SpeakerBubble} alt="발언자 순서보기" className="absolute -top-1/4 -right-3  w-[50%]" />
      </div>

      <div className="mb-[5px] p-2 text-center">
        <button
          disabled={isQuestionStart === 2 || (isMeetingStart === 1 && isQuestionStart === 0) || btnDisabled}
          onClick={stateChanger}
          className={`min-w-[120px] p-2 rounded-[12px] font-bold text-16px text-white
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

      {/* 발언자 순서 모달 */}
      {isSpeakerModalOpen && <SpeakerModal speakingOrder={speakingOrder} closeModal={setIsSpeakerModalOpen} />}
    </div>
  );
};

export default Question;
