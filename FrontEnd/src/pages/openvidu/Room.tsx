import { useEffect, useRef, useState } from "react";
import { Message, UserModelType } from "@/utils/openviduTypes";
import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
// import Recording from "@pages/openvidu/Recording";
import EmotionModal from "@/components/Openvidu-call/components/emotionModal/EmotionModal";
import Question from "@components/Openvidu-call/components/questions/Question";
import { Session } from "openvidu-browser";

/*
- 미팅 시작하기 전, 시작하겠습니다 멘트
- 미팅 시작되면, 질문 시작 전 상태
  - 잠시 후, "1"번째 질문이 시작됩니다.
  - 질문 차례 띄우기

  - 하나의 질문이 시작되면,
    - 질문 띄우기: question.detail
    - 답변시작하기 버튼

  - 하나의 질문이 끝나면 (모든 차례까 다 돌아가고 나면), 다음 질문으로'

  전체 모임 시간이 10분 미만으로 남을 경우, 강제로 마지막 질문을 띄우기

*/

interface RoomProps {
  meetingId: number;
  session: Session;
  mySessionId: string;
  localUser: UserModel;
  subscribers: UserModelType[];
  showNotification?: boolean;
  checkNotification?: () => void;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  handleRemoveUser: () => void;
}

function Room({
  meetingId,
  session,
  mySessionId,
  localUser,
  subscribers,
  camStatusChanged,
  micStatusChanged,
  handleRemoveUser,
}: RoomProps) {
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const chatScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      const handleChatMessage = (event: any) => {
        const data = JSON.parse(event.data);
        const newMessage: Message = {
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        };
        setMessageList((prev) => [...prev, newMessage]);

        // 스크롤 처리
        setTimeout(() => {
          if (chatScroll.current) {
            chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
          }
        }, 20);
      };

      session.on("signal:chat", handleChatMessage);

      return () => {
        session.off("signal:chat", handleChatMessage);
      };
    }
  }, [session, chatScroll]);

  return (
    <section className="w-full h-[calc(100vh-80px)] px-[20px] flex flex-col justify-center items-center bg-offWhite font-suite">
      <Question meetingId={meetingId} session={session} mySessionId={mySessionId} />

      <div className="w-full h-[80%] grid grid-cols-3 gap-4">
        {localUser && localUser.getStreamManager() && (
          <div className="w-full h-full">
            <StreamComponent user={localUser} />
          </div>
        )}

        {subscribers.map((sub, i) => (
          <div key={i} className="w-full h-full">
            <StreamComponent user={sub} streamId={sub.getStreamManager().stream.streamId} />
          </div>
        ))}
      </div>
      {/* <div>
        <Recording sessionID={mySessionId} />
      </div> */}
      <div className="h-[10%] mb-[20px]">
        <ToolbarComponent
          user={localUser}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          toggleChat={setIsChatModalOpen}
          setIsCloseModalOpen={setIsEmotionModalOpen}
        />
      </div>

      {isEmotionModalOpen && (
        <EmotionModal setIsEmotionModalOpen={setIsEmotionModalOpen} handleRemoveUser={handleRemoveUser} />
      )}
      {isChatModalOpen && (
        <ChatComponent
          user={localUser && localUser.getStreamManager() ? localUser : new UserModel()}
          close={setIsChatModalOpen}
          messageList={messageList}
          chatScroll={chatScroll}
        />
      )}
    </section>
  );
}

export default Room;
