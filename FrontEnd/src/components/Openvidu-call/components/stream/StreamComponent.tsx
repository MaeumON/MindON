import React from "react";
import OvVideoComponent from "./OvVideo";

interface StreamComponentProps {
  user: UserModel;
  handleNickname?: (nickname: string) => void;
  streamId?: string;
}

interface UserModel {
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  getStreamManager: () => any;
  getNickname: () => string;
  isLocal: () => boolean;
}

//미사용으로 인한 주석 처리
// interface StreamComponentState {
//   nickname: string;
//   mutedSound: boolean;
//   isFormValid: boolean;
// }

const StreamComponent: React.FC<StreamComponentProps> = ({ user }) => {
  //추후 개발 시 주석 해제 필요
  // const [state, setState] = useState<StreamComponentState>({
  //   nickname: user.getNickname(),
  //   mutedSound: false,
  //   isFormValid: true,
  // });

  const state = { nickname: user.getNickname(), mutedSound: false, isFormValid: true };

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="w-[50%] bg-black text-white">
        <div>
          <span id="nickname">{user.getNickname()}</span>
          {user.isLocal() && <span id=""> (edit)</span>}
        </div>
      </div>

      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} mutedSound={state.mutedSound} />
          {/* 오디오, 비디오 온오프에 따라 아이콘 띄우는 화면 */}
        </div>
      ) : null}
    </div>
  );
};

export default StreamComponent;
