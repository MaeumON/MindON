import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
import { UserModelType } from "@utils/openviduTypes";

interface RoomProps {
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

function Room({
  localUser,
  subscribers,
  showNotification,
  checkNotification,
  camStatusChanged,
  micStatusChanged,
  leaveSession,
  toggleChat,
  stateChatDisplay,
}: RoomProps) {
  return (
    <section className="container m-auto h-screen bg-offWhite flex flex-col justify-center items-center">
      <div className="h-[10%]">모임 제목</div>
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
            <ChatComponent
              user={localUser as UserModel}
              chatDisplay={stateChatDisplay}
              close={toggleChat}
              messageReceived={checkNotification}
            />
          </div>
        )}
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
