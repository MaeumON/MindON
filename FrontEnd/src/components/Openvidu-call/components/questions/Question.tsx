import { useQuestionStore } from "@/stores/questionStore";
import { UserModelType } from "@/utils/openviduTypes";
import { useEffect, useState } from "react";

interface QuestionProps {
  mySessionId: string;
  subscribers: UserModelType[];
}

const userId = 1;

const Question = ({ mySessionId, subscribers }: QuestionProps) => {
  const {
    questions,
    isMeetingStart,
    isQuestionStart,
    currentQuestionNumber,
    currentUser,
    currentQuestionText,
    currentBtnText,
    fetchQuestionsData,
    setIsMeetingStart,
    setIsQuestionStart,
    setCurrentQuestionNumber,
    setCurrentUser,
    setCurrentQuestionText,
    setCurrentBtnText,
  } = useQuestionStore();

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); //현재 발언 중인지 여부

  //setUsers를 사용하지 않아 일단 주석 처리
  // 추후 받아오면, 저장 후 사용
  // const [users, setUsers] = useState<number[]>([1, 2, 3, 4, 5]); //참여자 목록
  const users = [1, 2, 3, 4, 5];

  function stateChanger() {
    //미팅 시작 전
    if (isMeetingStart === 0) {
      setIsMeetingStart(1);
      setIsQuestionStart(0);
      setCurrentQuestionText("잠시 후 질문이 시작됩니다.");

      console.log("subscribers", subscribers);
      return;
    }

    //질문 시작 전
    if (isMeetingStart === 1 && isQuestionStart === 0) {
      setIsQuestionStart(1);
      setCurrentQuestionText(questions[0].detail);
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
      if (currentUser === userId && !isSpeaking) {
        setIsSpeaking(true);
        return;
      } else if (currentUser === userId && isSpeaking) {
        setIsSpeaking(false);
        setCurrentUser(currentUser + 1);
        return;
      }

      //하나의 질문 종료
      if (currentUser === users.length - 1) {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
        setCurrentUser(0);
        setCurrentQuestionText(questions[currentQuestionNumber + 1].detail);
      } else {
        setCurrentUser(currentUser + 1);
      }
    }
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
      if (currentUser === userId && !isSpeaking) {
        return "답변 시작하기";
      } else if (currentUser === userId && isSpeaking) {
        return "답변 중단하기";
      }

      return `${currentUser}님이 발언 중이에요`;
    }
    return currentBtnText;
  };

  useEffect(() => {
    //질문 받아와서 전역에 설정
    fetchQuestionsData(mySessionId);

    setCurrentQuestionText("잠시 후, 모임이 시작됩니다.");
    setCurrentBtnText("모임 바로 시작하기");
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
            : isMeetingStart === 1 && isQuestionStart === 1 && currentUser !== userId
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
