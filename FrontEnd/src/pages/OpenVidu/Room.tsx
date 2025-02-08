import { useEffect, useState } from "react";
import { UserModelType } from "@/utils/openviduTypes";
import ChatComponent from "@components/Openvidu-call/components/chat/ChatComponent";
import StreamComponent from "@components/Openvidu-call/components/stream/StreamComponent";
import ToolbarComponent from "@components/Openvidu-call/components/toolbar/ToolbarComponent";
import UserModel from "@components/Openvidu-call/models/user-model";
import Recording from "@pages/openvidu/Recording";
import EmotionModal from "@/components/Openvidu-call/components/emotionModal/EmotionModal";
import Question from "@components/Openvidu-call/components/questions/Question";

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
  mySessionId: string;
  localUser: UserModel;
  subscribers: UserModelType[];
  showNotification?: boolean;
  checkNotification?: () => void;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  handleCloseSession: () => void;
  handleRemoveUser: () => void;
}

function Room({
  mySessionId,
  localUser,
  subscribers,
  camStatusChanged,
  micStatusChanged,
  handleCloseSession,
  handleRemoveUser,
}: RoomProps) {
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);

  useEffect(() => {}, []);

  return (
    <section className="w-full h-[calc(100vh-80px)] px-[20px] flex flex-col justify-center items-center bg-offWhite font-suite">
      <Question mySessionId={mySessionId} subscribers={subscribers} />

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
      </div>
      <div>
        <Recording sessionID={mySessionId} />
      </div>
      <div className="h-[10%] mb-[20px]">
        <ToolbarComponent
          user={localUser}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          toggleChat={setIsChatModalOpen}
          setIsEmotionModalOpen={setIsEmotionModalOpen}
        />
      </div>

      {isEmotionModalOpen && (
        <EmotionModal
          setIsEmotionModalOpen={setIsEmotionModalOpen}
          handleCloseSession={handleCloseSession}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      {isChatModalOpen && (
        <ChatComponent
          user={localUser && localUser.getStreamManager() ? localUser : new UserModel()}
          close={setIsChatModalOpen}
        />
      )}
    </section>
  );
}

export default Room;
