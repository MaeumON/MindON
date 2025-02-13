import IconExit from "@/assets/icons/IconExit";
import { QuestionSpeakingOrderType } from "@/utils/openvidu/openviduTypes";

interface SpeakerModalProps {
  speakingOrder: QuestionSpeakingOrderType[];
  closeModal: (isOpen: boolean) => void;
}

const SpeakerModal = ({ speakingOrder, closeModal }: SpeakerModalProps) => {
  function handleCloseModal() {
    closeModal(false);
  }

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] py-[50px] flex flex-col items-center justify-start bg-offWhite rounded-[12px] font-suite">
        <div className="flex w-full h-[10%] items-center justify-center">
          <p className="w-[80%] font-suite font-bold text-28px text-center">발언자 순서</p>
          <div className="w-[5px]">
            <div onClick={handleCloseModal}>
              <IconExit width={25} height={25} fillColor="" />
            </div>
          </div>
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
