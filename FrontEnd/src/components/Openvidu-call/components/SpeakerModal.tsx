import React from "react";
import IconExit from "@/assets/icons/IconExit";
import { QuestionSpeakingOrderType } from "@/utils/openvidu/openviduTypes";

interface SpeakerModalProps {
  speakingOrder: QuestionSpeakingOrderType[];
  closeModal: (isOpen: boolean) => void;
}

const SpeakerModal = ({ speakingOrder, closeModal }: SpeakerModalProps) => {
  function handleCloseModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    closeModal(false);
  }

  function handleModalClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50 z-50" onClick={handleCloseModal}>
      <div
        className="w-[85%] py-[50px] flex flex-col items-center justify-start bg-offWhite rounded-[12px] font-suite"
        onClick={handleModalClick}
      >
        <div className="flex w-full h-[10%] items-center justify-between px-[30px]">
          <p className="flex-1 font-suite font-bold text-28px text-center">발언자 순서</p>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            type="button"
          >
            <IconExit width={25} height={25} fillColor="" />
          </button>
        </div>
        <div className="w-full h-[80%] mt-[20px] flex flex-col justify-center items-center gap-[10px]">
          {speakingOrder.map((order) => (
            <div key={order.no} className="flex items-end justify-center gap-[5px] text-20px font-bold text-center">
              {order.no}. {order.userName}
              <p className="font-medium text-18px">님</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakerModal;
