import { useEffect, useState } from "react";
import { fetchQuestions } from "@apis/questionApi";
import { questionType } from "@/apis/types/questions";
import { UserModelType } from "@/utils/openviduTypes";
// import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
import Recording from "./Recording";

/*
- 미팅 시작하기 전, 시작하겠습니다 멘트
- 미팅 시작되면, 질문 시작 전 상태
  - 잠시 후, "1"번째 질문이 시작됩니다.
  - 질문 차례 띄우기

  - 하나의 질문이 시작되면,
    - 질문 띄우기: question.detail
    - 답변시작하기 버튼

  - 하나의 질문이 끝나면 (모든 차례까 다 돌아가고 나면), 다음 질문으로

*/

interface RoomProps {
  mySessionId: string;
  localUser: UserModel;
  subscribers: UserModelType[];
  showNotification: boolean;
  checkNotification: () => void;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  leaveSession: () => void;
  toggleChat: () => void;
  stateChatDisplay: string;
}

const userId = 1;

function Room({
  mySessionId,
  localUser,
  subscribers,
  showNotification,
  // checkNotification,
  camStatusChanged,
  micStatusChanged,
  leaveSession,
  toggleChat,
  stateChatDisplay,
}: RoomProps) {
  const [isMeetingStart, setIsMeetingStart] = useState<number>(0); //0: 미팅 시작 전, 1: 미팅 시작 후
  const [isQuestionStart, setIsQuestionStart] = useState<number>(0); //0: 질문 시작 전, 1: 질문 시작 후

  const [questions, setQuestions] = useState<questionType[]>([]); //질문 목록
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0); //현재 질문 번호
  const [currentUser, setCurrentUser] = useState<number>(0); //현재 답변자 번호
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); //현재 발언 중인지 여부

  //setUsers를 사용하지 않아 일단 주석 처리
  // const [users, setUsers] = useState<number[]>([1, 2, 3, 4, 5]); //참여자 목록
  const users = [1, 2, 3, 4, 5];

  const [currentQuestion, setCurrentQuestion] = useState<string>(""); //현재 질문
  const [currentBtnText, setCurrentBtnText] = useState<string>(""); //현재 버튼 텍스트

  //질문 목록 받아오기
  const getQuestions = async () => {
    const data = await fetchQuestions(mySessionId);
    setQuestions(data);
  };

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

  const stateChanger = () => {
    //미팅 시작 전
    if (isMeetingStart === 0) {
      setIsMeetingStart(1);
      setIsQuestionStart(0);
      setCurrentQuestion("잠시 후 질문이 시작됩니다.");
      return;
    }

    //질문 시작 전
    if (isMeetingStart === 1 && isQuestionStart === 0) {
      setIsQuestionStart(1);
      setCurrentQuestion(questions[0].detail);
      return;
    }

    //질문 중
    if (isMeetingStart === 1 && isQuestionStart === 1) {
      //질문 완전 종료
      if (currentQuestionNumber === questions.length - 1) {
        setCurrentQuestion("모임이 종료되었습니다.");
        setIsQuestionStart(2);
        return;
      }

      //답변 시작
      if (currentUser === userId && !isSpeaking) {
        setIsSpeaking(true);
        return;
      } else if (currentUser === userId && isSpeaking) {
        setIsSpeaking(false);
        setCurrentUser((prev) => prev + 1);
        return;
      }

      //하나의 질문 종료
      if (currentUser === users.length - 1) {
        setCurrentQuestionNumber((prev) => prev + 1);
        setCurrentUser(0);
        setCurrentQuestion(questions[currentQuestionNumber + 1].detail);
      } else {
        setCurrentUser((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    //질문 받아오기 함수 실행
    getQuestions();

    setCurrentQuestion("잠시 후, 모임이 시작됩니다.");
    setCurrentBtnText("모임 바로 시작하기");
  }, []);

  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-offWhite font-suite">
      <div className="p-2 w-full flex flex-col justify-center bg-white rounded-[12px]">
        <div className="m-2 p-4 rounded-[12px] font-bold text-24px bg-offWhite">{currentQuestion}</div>
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

      <div id="layout" className="w-full h-[80%]">
        {localUser && localUser.getStreamManager() && (
          <div className="w-[45%] h-[45%]" id="localUser">
            <StreamComponent user={localUser} />
          </div>
        )}

        {subscribers.map((sub, i) => (
          <div key={i} className="w-[50%] h-[50%]" id="remoteUsers">
            <StreamComponent user={sub} streamId={sub.getStreamManager().stream.streamId} />
          </div>
        ))}

        {localUser && localUser.getStreamManager() && (
          <div className="" style={{ display: stateChatDisplay }}>
            {/*
            채팅 기능 구현 시 주석 삭제 
            <ChatComponent
              user={localUser && localUser.getStreamManager() ? localUser : undefined}
              chatDisplay={stateChatDisplay}
              close={toggleChat}
              messageReceived={checkNotification}
            /> */}
          </div>
        )}
      </div>
      <div>
        <Recording />
      </div>
      <div className="h-[10%]">
        <ToolbarComponent
          user={localUser}
          showNotification={showNotification}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          leaveSession={leaveSession}
          toggleChat={toggleChat}
        />
      </div>
    </section>
  );
}

export default Room;
