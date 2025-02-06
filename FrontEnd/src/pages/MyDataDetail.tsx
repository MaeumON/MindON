import Header from "@/components/Layout/Header";
import Delight from "@/assets/images/feeling/feelingDelight.png";
import Happy from "@/assets/images/feeling/feelingHappy.png";
import Mad from "@/assets/images/feeling/feelingMad.png";
import Nervous from "@/assets/images/feeling/feelingNervous.png";
import Piece from "@/assets/images/feeling/feelingPiece.png";
import Proud from "@/assets/images/feeling/feelingProud.png";
import Sad from "@/assets/images/feeling/feelingSad.png";
import Tired from "@/assets/images/feeling/feelingTired.png";

function MyDataDetail() {
  return (
    <div>
      <Header title="마이데이터" isicon={true} />
      <div className="p-[20px]">
        <div className="rounded-[8px] bg-white  shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)]  overflow-hidden p-4 ]">
          <div>
            <span>치매환자 가족모임</span>
            <span>에 참여하셨군요.</span>
          </div>
          <div>이하영님의 기분은 극대노</div>
          <div>
            <img className="w-[33px] h-[33px] left-[218px] top-[131px] absolute" src={Delight} />
            <img className="w-[34px] h-[33px] left-[247px] top-[170px] absolute" src={Happy} />
            <img className="w-[33px] h-[33px] left-[298px] top-[131px] absolute" src={Mad} />
            <img className="w-[33px] h-[34px] left-[170px] top-[152px] absolute" src={Nervous} />
            <img className="w-[34px] h-[34px] left-[86px] top-[170px] absolute" src={Piece} />
            <img className="w-[33px] h-[34px] left-[125px] top-[129px] absolute" src={Proud} />
            <img className="w-[33px] h-[33px] left-[43px] top-[176px] absolute" src={Sad} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyDataDetail;
