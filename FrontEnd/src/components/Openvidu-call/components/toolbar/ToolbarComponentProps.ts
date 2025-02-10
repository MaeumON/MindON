interface UserModel {
  isAudioActive: () => boolean;
  isVideoActive: () => boolean;
  getStreamManager: () => any;
}

export interface ToolbarComponentProps {
  user?: UserModel;
  showNotification?: boolean;
  camStatusChanged: () => void;
  micStatusChanged: () => void;
  toggleChat: (isOpen: boolean) => void;
  setIsCloseModalOpen: (isOpen: boolean) => void;
}
