import IconHome from "@/assets/icons/IconHome";
import IconPeople from "@/assets/icons/IconPeople";
import IconChart from "@/assets/icons/IconChart";
import IconPlus from "@/assets/icons/IconPlus";
import IconProfile from "@/assets/icons/IconProfile";

function Footer() {
  return (
    <footer className="flex justify-around items-center shadow-md fixed bottom-0 h-[74px] bg-white w-full max-w-[412px] mx-auto">
      {/* 홈 버튼 */}
      <div className="flex flex-col items-center gap-1.5">
        <IconHome />
        <span className="text-cardContent text-sm font-bold font-suite">홈</span>
      </div>

      {/* 모임 버튼 (HouseIcon 추가됨) */}
      <div className="flex flex-col items-center gap-1.5">
        <IconPeople className=" text-cardContent" />
        <span className="text-cardContent text-sm font-bold font-suite">모임</span>
      </div>

      {/* 중앙 버튼 (추가 기능 버튼) */}
      <div className="mb-10">
        <IconPlus />
      </div>

      {/* 마이데이터 버튼 */}
      <div className="flex flex-col items-center gap-1.5">
        <IconChart />
        <span className="text-orange100 text-sm font-bold font-suite">마이데이터</span>
      </div>

      {/* 프로필 버튼 */}
      <div className="flex flex-col items-center gap-1.5">
        <IconProfile />
        <span className="text-cardContent text-sm font-bold font-suite">프로필</span>
      </div>
    </footer>
  );
}

export default Footer;
