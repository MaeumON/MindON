import React from "react";

interface ToolbarComponentProps {
  user?: UserModel;
  showNotification: boolean;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  toggleChat: () => void;
  setIsEmotionModalOpen: (isOpen: boolean) => void;
}

interface UserModel {
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  isScreenShareActive: () => boolean;
  getStreamManager: () => any;
}

const ToolbarComponent: React.FC<ToolbarComponentProps> = ({
  user,
  showNotification,
  camStatusChanged,
  micStatusChanged,
  toggleChat,
  setIsEmotionModalOpen,
}) => {
  //감정 기록 모달 띄우기
  function handleLeaveSession() {
    setIsEmotionModalOpen(true);
  }

  return (
    <div className="bg-red" id="header">
      <div className="flex justify-between items-center bg-gray-600">
        <div className="w-[80%] flex justify-center items-center">
          <button className="m-1  bg-green-500" onClick={micStatusChanged}>
            {user && user.isAudioActive() ? <p>MIC ON</p> : <p>MIC OFF</p>}
          </button>

          <button className="m-1 bg-green-500" onClick={camStatusChanged}>
            {user && user.isVideoActive() ? <p>CAM ON</p> : <p>CAM OFF</p>}
          </button>

          <button className="m-1 bg-green-500" onClick={handleLeaveSession} id="navLeaveButton">
            <p>LEAVE</p>
          </button>

          <button className="m-1 w-[100%] h-10 bg-green-500 text-black" onClick={toggleChat}>
            CHAT
            {showNotification && <div className="w-2 h-2 bg-red-500" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolbarComponent;
