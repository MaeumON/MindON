import React, { useState } from "react";
import OvVideoComponent from "./OvVideo";
import UserModel from "../../models/user-model";
import { Session } from "openvidu-browser";
import IconMegaphone from "@assets/icons/IconMegaphone.png";

interface StreamComponentProps {
  user: UserModel;
  session?: Session;
  streamId?: string;
  setIsReportModalOpen?: (isOpen: boolean) => void;
  setReportedUserId?: (userId: string) => void;
  setReportedUserName?: (userName: string) => void;
}

//미사용으로 인한 주석 처리
interface StreamComponentState {
  nickname: string;
  mutedSound: boolean;
  isFormValid: boolean;
  userId: string;
}

const StreamComponent: React.FC<StreamComponentProps> = ({
  user,
  session,
  setIsReportModalOpen,
  setReportedUserId,
  setReportedUserName,
}) => {
  //추후 개발 시 주석 해제 필요
  const [state, setState] = useState<StreamComponentState>({
    userId: user.getUserId(),
    nickname: user.getNickname(),
    mutedSound: false,
    isFormValid: true,
  });

  //미사용으로 인한, setState
  console.log(setState);

  function handleClickReport() {
    if (setIsReportModalOpen && setReportedUserId && setReportedUserName) {
      setIsReportModalOpen(true);
      setReportedUserId(user.getUserId());
      setReportedUserName(user.getNickname());
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-[5px]">
      <div className="px-[5px] w-[100%] text-black font-bold">
        <div className="flex justify-between items-center">
          <span>{user.getNickname()}</span>
          {setReportedUserId && (
            <div className="cursor-pointer" onClick={handleClickReport}>
              <img src={IconMegaphone} alt="신고 기능" className="w-[30px] h-[22px]" />
            </div>
          )}
        </div>
      </div>

      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} session={session} mutedSound={state.mutedSound} />
          {/* 오디오, 비디오 온오프에 따라 아이콘 띄우는 화면 */}
        </div>
      ) : null}
    </div>
  );
};

export default StreamComponent;
