interface EmotionModalProps {
  setIsEmotionModalOpen: (isOpen: boolean) => void;
  leaveSession: () => void;
}

function EmotionModal({ setIsEmotionModalOpen, leaveSession }: EmotionModalProps) {
  function handleCloseModal() {
    setIsEmotionModalOpen(false);
    leaveSession();
  }
  return (
    <div>
      <button onClick={handleCloseModal} className="p-2 rounded-md bg-red-500">
        leave Session
      </button>
    </div>
  );
}

export default EmotionModal;
