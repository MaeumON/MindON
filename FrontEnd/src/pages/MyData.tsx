import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import JypBear from "@/assets/images/jypbear.png";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/ShadowCard";

function MyData() {
  const { data } = useAuthStore();
  const nav = useNavigate();

  interface userDataType {
    name: string;
    temperture: number;
  }

  const userData: userDataType | null = {
    name: data.userName || "사용자",
    temperture: 40,
  };

  let warmtitle = "OFF";
  if (userData.temperture >= 50) {
    warmtitle = "뜨끈한 온돌";
  } else if (userData.temperture >= 30) {
    warmtitle = "따뜻한 핫팩";
  } else {
    warmtitle = "데워지는 중";
  }

  return (
    <div>
      <Header title={"마음 리포트"} isicon={true} />
      <div className="maincontent p-[20px]">
        <div className="HeadMsg flex justify-center gap-2">
          <div className="Msg flex flex-col justify-center whitespace-nowrap">
            <div className="text-22px font-suite font-semibold">오늘의 {userData.name}님은</div>
            <div className="text-24px font-jamsilMedium">충분히 따뜻했나요?</div>
          </div>
          <img src={JypBear} alt="JypBear" className="sm:w-[100px] sm:h-[100px] w-[80px] h-[80px]" />{" "}
        </div>
        <div className="flex flex-col gap-[20px] items-center bg-white p-[20px]">
          <div className="f">{userData.name}님의 마음온도</div>
          <div>이부분 차트 들어가고</div>
          <div>{userData.name}님의 마음은</div>
          <div>{warmtitle}</div>
        </div>

        <div className="flex flex-col gap-[20px] p-[20px]">
          <div>온이와 함께한 모임 분석 및 요약</div>
          {/* nav 주소 수정 예정정 */}
          <Card onClick={() => nav("/ongoinggroups")} className="items-center">
            <div className="px-[10px] py-[5px]">
              <div className="flex justify-between">
                <div className="text-24px font-suite font-extrabold text-cardLongContent">참여중인 모임</div>
                <div>👉</div>
              </div>
              <div className="text-16px font-suite font-bold text-cardContent">
                지금 진행 중인 모임에 대한 분석이에요
              </div>
            </div>
          </Card>
          <Card onClick={() => nav("/endgroups")} className="items-center">
            <div className="px-[10px] py-[5px]">
              <div className="flex justify-between">
                <div className="text-24px font-suite font-extrabold text-cardLongContent ">종료된 모임</div>
                <div>👉</div>
              </div>
              <div className="text-16px font-suite font-bold text-cardContent">
                과거 마무리된 모임에 대한 분석이에요
              </div>
            </div>
          </Card>
          <div className="h-[50px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyData;
