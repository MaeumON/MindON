import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import JypBear from "@/assets/images/bear/jypbear.png";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/ShadowCard";
import IconInfo from "@/assets/icons/IconInfo";
import IconArrowRight from "@/assets/icons/IconArrowRight";
import TempertureChart from "@/components/Mydata/TempertureChart";
import { useState } from "react";

function MyData() {
  const { userName } = useAuthStore();
  const username = userName || "사용자";
  const nav = useNavigate();

  // IconInfo 툴팁 상태
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const handleInfoClick = () => {
    setIsInfoVisible(true); // 설명창 표시
    setTimeout(() => {
      setIsInfoVisible(false);
    }, 3000);
  };

  return (
    <div>
      <Header title={"마음 리포트"} isicon={false} />
      <div className="maincontent p-[10px]">
        <div className="HeadMsg flex justify-center gap-2">
          <div className="Msg flex flex-col justify-center whitespace-nowrap">
            <div className="text-22px font-suite font-semibold">오늘의 {username}님은</div>
            <div className="text-24px font-jamsilMedium">충분히 따뜻했나요?</div>
          </div>
          <img src={JypBear} alt="JypBear" className="sm:w-[100px] sm:h-[105px] w-[80px] h-[85px]" />{" "}
        </div>
        <Card className="flex flex-col gap-[20px] items-center mx-[20px]">
          <div className="flex gap-1 w-full p-1">
            <div className="text-cardLongContent font-suite font-bold text-16px">
              {username}님의 <span className="underline underline-offset-4 decoration-1">마음온도</span>
            </div>
            <div
              className="relative flex flex-col justify-center"
              onMouseEnter={() => setIsInfoVisible(true)}
              onMouseLeave={() => setIsInfoVisible(false)}
              onClick={handleInfoClick}
            >
              <IconInfo className=" text-cardLongContent" />
              {isInfoVisible && (
                <div className="absolute left-[-100px] top-7 bg-white text-cardLongContent p-2 rounded shadow-md font-suite font-[500] text-14px z-10 w-[220px]">
                  마음온도는 모임이 끝난 뒤의 감정과
                  <br />
                  참여율을 바탕으로 측정되어요.
                </div>
              )}
            </div>
          </div>
          <TempertureChart username={username} />
        </Card>

        <div className="flex flex-col gap-[20px] p-[20px] mt-[20px]">
          <div className="font-suite font-[700] text-20px text-cardLongContent">온이와 함께한 모임 분석 및 요약</div>
          <div className="flex flex-col gap-5">
            {/* nav 주소 수정 예정 */}
            <Card onClick={() => nav("/mydata/grouplist/1")} className="items-center">
              <div className="ps-[10px] py-[5px]">
                <div className="flex justify-between">
                  <div className="text-24px font-suite font-[700] text-cardLongContent">참여중인 모임</div>
                  <IconArrowRight />
                </div>
                <div className="text-14px font-suite font-[500] text-cardContent">
                  지금 진행 중인 모임에 대한 분석이에요
                </div>
              </div>
            </Card>
            <Card onClick={() => nav("/mydata/grouplist/2")} className="items-center">
              <div className="ps-[10px] py-[5px]">
                <div className="flex justify-between">
                  <div className="text-24px font-suite font-[700]  text-cardLongContent ">종료된 모임</div>
                  <IconArrowRight />
                </div>
                <div className="text-14px font-suite font-[500] text-cardContent">
                  과거 마무리된 모임에 대한 분석이에요
                </div>
              </div>
            </Card>
          </div>

          <div className="h-[50px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyData;
