import { saveEmotion } from "@/apis/openvidu/emotionApi";
import IconExit from "@assets/icons/IconExit";
import { emotionList } from "@utils/emotionList";
import { useState } from "react";

interface EmotionModalProps {
  meetingId: number;
  setIsEmotionModalOpen: (isOpen: boolean) => void;
  handleRemoveUser: () => void;
}

function EmotionModal({ meetingId, setIsEmotionModalOpen, handleRemoveUser }: EmotionModalProps) {
  const [selectedEmotionId, setSelectedEmotionId] = useState<number>(0);

  function handleCloseModal() {
    setIsEmotionModalOpen(false);
  }

  function handleClickSaveEmotion() {
    console.log("selectedEmotionId", selectedEmotionId);
    saveEmotion(meetingId, selectedEmotionId);
    handleRemoveUserBtn();
  }

  function handleRemoveUserBtn() {
    setIsEmotionModalOpen(false);
    handleRemoveUser();
  }

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] h-[450px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
        <div className="flex items-start justify-between w-full">
          <div className="w-[10%]"></div>
          <div className="w-[70%] flex flex-col items-center justify-center font-jamsilRegular text-24px">
            <p>모임은 어떠셨나요?</p>
            <p>지금 기분을 말해주세요</p>
          </div>
          <div className="mt-[5px] mr-[15px]">
            {/* <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span> */}
            <div onClick={handleCloseModal}>
              <IconExit width={25} height={25} fillColor="" />
            </div>
          </div>
        </div>

        <div className="w-[85%] mt-[30px] flex flex-col gap-[20px]">
          <div className="flex justify-between">
            {emotionList.slice(0, 4).map((emotion) => (
              <div
                key={emotion.id}
                onClick={() => setSelectedEmotionId(emotion.id)}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`relative w-[60px] h-[60px] cursor-pointer
                  ${selectedEmotionId === emotion.id ? "after:absolute after:inset-0 after:bg-black/20 after:rounded-full" : ""}`}
                >
                  <img src={emotion.src} alt={emotion.alt} className="w-full h-full" />
                </div>
                <p>{emotion.text}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {emotionList.slice(4, 8).map((emotion) => (
              <div
                key={emotion.id}
                onClick={() => setSelectedEmotionId(emotion.id)}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`relative w-[60px] h-[60px] cursor-pointer
                  ${selectedEmotionId === emotion.id ? "after:absolute after:inset-0 after:bg-black/20 after:rounded-full" : ""}`}
                >
                  <img src={emotion.src} alt={emotion.alt} className="w-full h-full" />
                </div>
                <p>{emotion.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[85%] mt-[25px] flex justify-center gap-[10px]">
          <button
            onClick={handleRemoveUserBtn}
            className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-cardContent cursor-pointer z-100"
          >
            모임 종료
          </button>
          <button
            onClick={handleClickSaveEmotion}
            className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-green100 cursor-pointer"
          >
            저장하기
          </button>
        </div>
      </div>
    </section>
  );
}

export default EmotionModal;
