import { Session, StreamManager, Device } from "openvidu-browser";

export interface VideoRoomProps {
  sessionId?: string;
  userName?: string;
  token?: string;
  joinSession?: () => void;
  leaveSession?: () => void;
}

export interface UserModelType {
  isLocal(): boolean;
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  isScreenShareActive: () => boolean;
  getStreamManager: () => StreamManager;
  setAudioActive: (active: boolean) => void;
  setVideoActive: (active: boolean) => void;
  setScreenShareActive: (active: boolean) => void;
  setStreamManager: (streamManager: StreamManager) => void;
  setConnectionId: (connectionId: string) => void;
  setNickname: (nickname: string) => void;
  getNickname: () => string;
  getConnectionId: () => string;
  setType: (type: string) => void;
}

export interface VideoRoomState {
  mySessionId: string;
  myUserName: string;
  session?: Session;
  localUser?: UserModelType;
  subscribers: UserModelType[];
  chatDisplay: string;
  currentVideoDevice?: Device;
  showExtensionDialog: boolean;
  messageReceived: boolean;
}
