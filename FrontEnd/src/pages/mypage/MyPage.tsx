// import IconSearch from "@assets/icons/IconSearch";
import ShadowCard from "@components/common/ShadowCard";
import Footer from "@components/Layout/Footer";
import Header from "@/components/Layout/Header";
import hellowbear from "@assets/images/bear/hellowbear.png";
import IconCalendar from "@assets/icons/IconCalendar.png";
import IconGrayCalendar from "@assets/icons/IconGrayCalendar.png";
import Card from "@/components/common/ShadowCard";
import IconArrowRight from "@/assets/icons/IconArrowRight";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@stores/authStore";

function MyPage() {
  const router = useNavigate();
  const { userName } = useAuthStore();
  return (
    <>
      <Header title={"마이페이지"} isicon={true} className="bg-yellow100" />
      <div className="relative w-full max-w-[412px] mx-auto whitespace-nowrap">
        {/* 노란박스 */}
        <section className="relative flex flex-col bg-yellow100 card-title h-[180px] px-[40px] py-[40px]"></section>
        {/* 흰색 박스 */}
        <ShadowCard className="absolute top-[20px] left-1/2 transform -translate-x-1/2 md:w-[370px] sm:w-[330px] w-[310px]">
          <div className="flex flex-col items-start gap-5">
            {/* 온이 이미지+글 */}
            <div className="justify-start items-center gap-2.5 inline-flex">
              {/* 온이 img */}
              <div className="justify-center items-center flex">
                <img
                  src={hellowbear}
                  alt="안녕 온이"
                  className="sm:w-[100px] sm:h-[90.2px] w-[120px] h-[110px] transform scale-x-[-1]"
                />
              </div>
              {/* text */}
              <div className="flex-col justify-start items-start gap-2.5 inline-flex ">
                <div>
                  <span className="text-[#3c3c3c] text-2xl font-medium font-suite leading-[38px]">
                    따뜻한 사람,
                    <br />
                  </span>
                  <span className="text-[#3c3c3c] text-[28px] font-medium font-jamsilBold leading-[38px]">
                    {userName}
                  </span>
                  <span className="text-[#3c3c3c] text-2xl font-medium font-jamsilMedium leading-[38px]">님</span>
                </div>
              </div>
            </div>
            {/* 캘린더 */}
            <div className="w-full ">
              <div className="flex justify-center items-center gap-8 text-center font-suite text-cardTitle">
                <div className="flex flex-col gap-1">
                  <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                    <img src={IconCalendar} alt="예정" className="w-full h-full" />
                    <span className="absolute text-black text-lg font-bold top-[26%] translate-y-0.5">3</span>
                  </div>
                  <span>예정</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                    <img src={IconCalendar} alt="참여중" className="w-full h-full" />
                    <span className="absolute text-black text-lg font-bold  top-[26%] translate-y-0.5">2</span>
                  </div>
                  <span>참여중</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                    <img src={IconGrayCalendar} alt="종료" className="w-full h-full" />
                    <span className="absolute text-black text-lg font-bold  top-[26%] translate-y-0.5">5</span>
                  </div>
                  <span>종료</span>
                </div>
              </div>
            </div>
          </div>
        </ShadowCard>

        {/* 나의 활동 */}

        <div className="mt-[70px] flex flex-col gap-5  mx-6 pt-[20px] border-3 border-solid border-red-500">
          <div className="font-suite font-[700] text-20px text-cardLongContent border-3 border-solid border-red-500">
            나의 활동
          </div>
          <div className="flex flex-col gap-6">
            {/* nav 주소 수정 예정 */}
            {/* onClick={() => router(`/groups/${groupsStatus}/list`)} */}
            <Card className="items-center">
              <div className="ps-[10px] py-[5px]">
                <div className="flex justify-between">
                  <div className="text-24px font-suite font-[700] text-cardLongContent">예정된 모임</div>
                  <IconArrowRight />
                </div>
                <div className="text-14px font-suite font-[500] text-cardContent">곧 함께 따뜻해질 모임이에요</div>
              </div>
            </Card>
            <Card className="items-center">
              <div className="ps-[10px] py-[5px]">
                <div className="flex justify-between">
                  <div className="text-24px font-suite font-[700] text-cardLongContent">참여 중 모임</div>
                  <IconArrowRight />
                </div>
                <div className="text-14px font-suite font-[500] text-cardContent">
                  지금 마음을 나누고 있는 모임이에요
                </div>
              </div>
            </Card>
            <Card onClick={() => router("/mypage/grouplist/2")} className="items-center">
              <div className="ps-[10px] py-[5px]">
                <div className="flex justify-between">
                  <div className="text-24px font-suite font-[700]  text-cardLongContent ">종료된 모임</div>
                  <IconArrowRight />
                </div>
                <div className="text-14px font-suite font-[500] text-cardContent">
                  지금까지 온기를 나눴던 사람들이에요
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-full flex gap-6 justify-start items-start font-suite mt-[40px]">
          <div className="flex flex-col justify-start items-start w-full ml-8 gap-1">
            <span className="text-cardContent2 text-lg font-semibold mb-2">정보 수정</span>
            <span className="text-cardLongContent font-bold text-[20px] cursor-pointer">내 정보 수정</span>
            <span className="text-cardLongContent font-bold text-[20px] cursor-pointer">회원 탈퇴</span>
          </div>
          <div className="flex flex-col justify-start items-start w-full mr-8 gap-1">
            <span className="text-cardContent2 text-lg font-semibold mb-2">문의 및 알림</span>
            <span className="text-cardLongContent font-bold text-[20px] cursor-pointer">공지사항</span>
            <span className="text-cardLongContent font-bold text-[20px] cursor-pointer">고객센터</span>
          </div>
        </div>
      </div>
      <div className="h-[150px]" />
      <Footer />
    </>
  );
}

export default MyPage;
