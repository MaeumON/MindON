interface UserModel {
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  isScreenShareActive: () => boolean;
  getStreamManager: () => any;
}

export interface ToolbarComponentProps {
  user?: UserModel;
  showNotification?: boolean;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  toggleChat: () => void;
  setIsEmotionModalOpen: (isOpen: boolean) => void;
}
