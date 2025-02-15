import { useEffect, useRef, useState } from "react";
import { Message, UserModelType } from "@/utils/openvidu/openviduTypes";
import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
import { Session } from "openvidu-browser";
import EndModal from "@/components/Openvidu-call/components/EndModal";
import ReportModal from "@/components/Openvidu-call/components/ReportModal";

interface RoomProps {
  meetingId: number;
  session: Session;
  mySessionId?: string;
  localUser: UserModel;
  subscribers: UserModelType[];
  showNotification?: boolean;
  checkNotification?: () => void;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  handleRemoveUser: () => void;
}

const NoHostRoom = ({
  meetingId,
  session,
  localUser,
  subscribers,
  camStatusChanged,
  micStatusChanged,
  handleRemoveUser,
}: RoomProps) => {
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportedUserId, setReportedUserId] = useState<string>("");
  const [reportedUserName, setReportedUserName] = useState<string>("");
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
      <div className="w-full h-[80%] grid grid-cols-3 gap-4">
        {localUser && localUser.getStreamManager() && (
          <div className="w-full h-full">
            <StreamComponent user={localUser} />
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
      <div className="h-[10%] mb-[20px]">
        <ToolbarComponent
          user={localUser}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          toggleChat={setIsChatModalOpen}
          setIsCloseModalOpen={setIsEndModalOpen}
        />
      </div>

      {isEndModalOpen && <EndModal setIsEndModalOpen={setIsEndModalOpen} handleRemoveUser={handleRemoveUser} />}
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
};

export default NoHostRoom;
