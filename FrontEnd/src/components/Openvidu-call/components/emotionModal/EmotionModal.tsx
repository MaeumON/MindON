import IconExit from "@assets/icons/IconExit";
import { emotionList } from "@utils/emotionList";

interface EmotionModalProps {
  setIsEmotionModalOpen: (isOpen: boolean) => void;
  handleCloseSession: () => void;
  handleRemoveUser: () => void;
}

function EmotionModal({ setIsEmotionModalOpen, handleCloseSession, handleRemoveUser }: EmotionModalProps) {
  function handleCloseModal() {
    setIsEmotionModalOpen(false);
  }

  function handleSelectEmotion(id: number) {
    console.log(id);
  }

  function handleRemoveUserBtn() {
    setIsEmotionModalOpen(false);
    handleRemoveUser();
  }

  function handleCloseMeeting() {
    setIsEmotionModalOpen(false);
    handleCloseSession();
  }
  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] h-[450px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
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
            onClick={handleCloseMeeting}
            className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-cardContent cursor-pointer z-100"
          >
            모임 종료
          </button>
          <button className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-green100 cursor-pointer">
            저장하기
          </button>
        </div>

        <div className="flex ">
          <div className="bg-white p-2 cursor-pointer" onClick={handleCloseModal}>
            모달만 닫기
          </div>
          <div className="bg-white p-2 cursor-pointer" onClick={handleRemoveUserBtn}>
            한 명만 나가기
          </div>
          <div className="bg-white p-2 cursor-pointer" onClick={handleCloseMeeting}>
            세션 종료
          </div>
        </div>

        <div className="absolute inset-0  mt-[10px] mr-[10px] flex items-start justify-end -z-10">
          <div onClick={handleCloseModal}>
            <IconExit width={25} height={25} fillColor="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmotionModal;
