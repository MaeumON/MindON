import { Session, StreamManager, Device } from "openvidu-browser";

export interface UserModelType {
  isLocal(): boolean;
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  getStreamManager: () => StreamManager;
  setAudioActive: (active: boolean) => void;
  setVideoActive: (active: boolean) => void;
  setStreamManager: (streamManager: StreamManager) => void;
  setConnectionId: (connectionId: string) => void;
  getNickname: () => string;
  getConnectionId: () => string;
  setType: (type: string) => void;
}

export interface VideoRoomState {
  sessionId: string;
  userName: string;
  session?: Session;
  localUser?: UserModelType;
  subscribers: UserModelType[];
  currentVideoDevice?: Device;
  messageReceived: boolean;
}

export interface QuestionChangedData {
  userId: string;
  speakingOrder: QuestionSpeakingOrderType[];
}

export //참여자 목록
interface ParticipantType {
  userId: string;
  userName: string;
}

export interface QuestionSpeakingOrderType {
  no: number;
  userId: string;
  userName: string;
}

export interface Message {
  connectionId: string;
  nickname: string;
  message: string;
}
