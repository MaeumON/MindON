import { emotionList } from "@utils/emotionList";

interface EmotionModalProps {
  setIsEmotionModalOpen: (isOpen: boolean) => void;
  leaveSession: () => void;
}

function EmotionModal({ setIsEmotionModalOpen, leaveSession }: EmotionModalProps) {
  function handleCloseModal() {
    setIsEmotionModalOpen(false);
    leaveSession();
  }

  function handleSelectEmotion(id: number) {
    console.log(id);
  }
  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] h-[400px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
        <div className="w-[90%] flex flex-col items-center justify-center font-jamsilRegular text-24px">
          <p>모임은 어떠셨나요?</p>
          <p>지금 기분을 말해주세요</p>
        </div>

        <div className="w-[85%] mt-[30px] flex flex-col gap-[20px]">
          <div className="flex justify-between">
            {emotionList.slice(0, 4).map((emotion) => (
              <div key={emotion.id} onClick={() => handleSelectEmotion(emotion.id)}>
                <img src={emotion.src} alt={emotion.alt} className="w-[60px] h-[60px] cursor-pointer" />
                <p>{emotion.text}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {emotionList.slice(4, 8).map((emotion) => (
              <div key={emotion.id} onClick={() => handleSelectEmotion(emotion.id)}>
                <img src={emotion.src} alt={emotion.alt} className="w-[60px] h-[60px] cursor-pointer" />
                <p>{emotion.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[85%] mt-[25px] flex justify-center gap-[10px]">
          <button
            onClick={handleCloseModal}
            className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-cardContent"
          >
            모임 종료
          </button>
          <button className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-green100">저장하기</button>
        </div>
      </div>
    </section>
  );
}

export default EmotionModal;
