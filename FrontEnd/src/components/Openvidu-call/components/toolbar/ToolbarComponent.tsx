import React from "react";
import { ToolbarComponentProps } from "./ToolbarComponentProps";
import IconMic from "@assets/icons/IconMic";
import IconVideo from "@assets/icons/IconVideo";
import IconChat from "@assets/icons/IconChat";
import IconExit from "@assets/icons/IconExit";
import IconCamOff from "@/assets/icons/IconCamOff";
import IconMicOff from "@/assets/icons/IconMicOff";

const ToolbarComponent: React.FC<ToolbarComponentProps> = ({
  user,
  camStatusChanged,
  micStatusChanged,
  toggleChat,
  setIsCloseModalOpen,
}) => {
  //감정 기록 모달 띄우기
  function handleLeaveSession() {
    setIsCloseModalOpen(true);
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-center items-center">
        <button
          className="m-1 w-[50px] h-[50px] flex justify-center items-center bg-white shadow-md rounded-[100px]"
          onClick={camStatusChanged}
        >
          {user && user.isVideoActive() ? (
            <IconVideo width={21} height={14} fillColor={"#000"} />
          ) : (
            <IconCamOff width={28} height={21} fillColor={"#000"} />
          )}
        </button>

        <button
          className="m-1 w-[50px] h-[50px] flex justify-center items-center bg-white shadow-md rounded-[100px]"
          onClick={micStatusChanged}
        >
          {user && user.isAudioActive() ? (
            <IconMic width={19} height={28} fillColor={"#000"} />
          ) : (
            <IconMicOff width={21} height={30} fillColor={"#000"} />
          )}
        </button>

        <button
          className="m-1 w-[50px] h-[50px] flex justify-center items-center bg-white shadow-md rounded-[100px] cursor-pointer"
          onClick={() => toggleChat(true)}
        >
          {<IconChat width={20} height={20} fillColor={"#000"} />}
        </button>

        <button
          className="m-1 w-[50px] h-[50px] flex justify-center items-center bg-white shadow-md rounded-[100px]"
          onClick={handleLeaveSession}
        >
          <IconExit width={21} height={23} className="text-red100" />
        </button>
      </div>
    </div>
  );
};

export default ToolbarComponent;
