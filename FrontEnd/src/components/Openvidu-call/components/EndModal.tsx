import IconExit from "@assets/icons/IconExit";

interface EmotionModalProps {
  setIsEndModalOpen: (isOpen: boolean) => void;
  handleRemoveUser: () => void;
}

const EndModal = ({ setIsEndModalOpen, handleRemoveUser }: EmotionModalProps) => {
  function handleCloseModal() {
    setIsEndModalOpen(false);
  }

  function handleRemoveUserBtn() {
    setIsEndModalOpen(false);
    handleRemoveUser();
  }

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] h-[200px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
        <div className="flex items-start justify-between w-full">
          <div className="w-[10%]"></div>
          <p className="font-jamsilRegular text-24px">모임을 종료하시겠습니까?</p>
          <div className="mt-[5px] mr-[15px]">
            {/* <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span> */}
            <div onClick={handleCloseModal}>
              <IconExit width={25} height={25} fillColor="" />
            </div>
          </div>
        </div>

        <div className="w-[85%] mt-[25px] flex justify-center gap-[10px]">
          <button
            onClick={handleRemoveUserBtn}
            className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-cardContent cursor-pointer z-100"
          >
            모임 종료
          </button>
          <button className="w-[130px] p-2 rounded-[12px] text-white font-bold bg-green100 cursor-pointer">
            저장하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default EndModal;
