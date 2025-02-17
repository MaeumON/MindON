import { useEffect, useRef, useState } from "react";
import { Message, UserModelType } from "@/utils/openvidu/openviduTypes";
import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
import EmotionModal from "@components/Openvidu-call/components/emotionModal/EmotionModal";
import Question from "@components/Openvidu-call/components/questions/Question";
import { Session } from "openvidu-browser";
import ReportModal from "@/components/Openvidu-call/components/ReportModal";

interface RoomProps {
  meetingId: number;
  session: Session;
  mySessionId: string;
  localUser: UserModel;
  subscribers: UserModelType[];
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
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportedUserId, setReportedUserId] = useState<string>("");
  const [reportedUserName, setReportedUserName] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const chatScroll = useRef<HTMLDivElement>(null);
  const [messageReceived, setMessageReceived] = useState<boolean>(false);

  // isChatModalOpen 상태가 변경될 때마다 messageReceived 초기화
  useEffect(() => {
    if (isChatModalOpen) {
      setMessageReceived(false);
    }
  }, [isChatModalOpen]);

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

        // 메시지를 보낸 사람이 자신이 아니고, 채팅창이 닫혀있을 때만 알림 표시
        if (event.from.connectionId !== localUser.getConnectionId() && !isChatModalOpen) {
          setTimeout(() => {
            if (chatScroll.current) {
              chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
            }
            setMessageReceived(true);
          }, 20);
        }
      };

      session.on("signal:chat", handleChatMessage);

      return () => {
        session.off("signal:chat", handleChatMessage);
      };
    }
  }, [session, chatScroll, localUser, isChatModalOpen]);

  return (
    <section className="w-full h-[calc(100vh-80px)] px-[20px] flex flex-col justify-center items-center bg-offWhite font-suite">
      <Question meetingId={meetingId} session={session} mySessionId={mySessionId} />

      <div className="w-full h-[620px] grid grid-cols-3 grid-rows-3 gap-4">
        {localUser && localUser.getStreamManager() && (
          <div className="w-full h-full">
            <StreamComponent user={localUser} session={session} />
          </div>
        )}

        {subscribers.map((sub, i) => (
          <div key={i} className="w-full h-full">
            <StreamComponent
              user={new UserModel(sub)}
              session={session}
              setIsReportModalOpen={setIsReportModalOpen}
              setReportedUserId={setReportedUserId}
              setReportedUserName={setReportedUserName}
            />
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
          showNotification={messageReceived}
        />
      </div>

      {/* 감정기록 모달 */}
      {isEmotionModalOpen && (
        <EmotionModal
          meetingId={meetingId}
          setIsEmotionModalOpen={setIsEmotionModalOpen}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      {/* 채팅 모달 */}
      {isChatModalOpen && (
        <ChatComponent
          user={localUser && localUser.getStreamManager() ? localUser : new UserModel()}
          close={setIsChatModalOpen}
          messageList={messageList}
          chatScroll={chatScroll}
        />
      )}
      {/* 신고 모달 */}
      {isReportModalOpen && (
        <ReportModal
          setIsReportModalOpen={setIsReportModalOpen}
          reportedUserId={reportedUserId}
          reportedUserName={reportedUserName}
          meetingId={meetingId}
        />
      )}
    </section>
  );
}

export default Room;
