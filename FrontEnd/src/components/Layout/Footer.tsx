import IconHome from "@/assets/icons/IconHome";
import IconPeople from "@/assets/icons/IconPeople";
import IconChart from "@/assets/icons/IconChart";
import IconPlus from "@/assets/icons/IconPlus";
import IconProfile from "@/assets/icons/IconProfile";
import { useNavigate } from "react-router-dom";

function Footer() {
  const nav = useNavigate();

  return (
    <footer className="flex justify-around items-center shadow-md fixed bottom-0 h-[74px] bg-white w-full max-w-[412px] mx-auto px-4">
      {/* 홈 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={() => {
          nav("/main");
        }}
      >
        <IconHome width={28} height={28} />
        <span className="text-cardContent text-14px font-bold font-suite">홈</span>
      </div>

      {/* 모임 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={() => {
          nav("/groups");
        }}
      >
        <IconPeople width={32} height={32} />
        <span className="text-cardContent text-14px font-bold font-suite">모임</span>
      </div>

      {/* 중앙 버튼 */}
      <div
        className="flex items-center justify-center w-[60px] h-[60px] bg-orange100 rounded-full shadow-md -translate-y-2 cursor-pointer"
        onClick={() => {
          nav("/createroom");
        }}
      >
        <IconPlus width={100} height={100} />
      </div>

      {/* 마이데이터 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5  cursor-pointer"
        onClick={() => {
          nav("/mydata");
        }}
      >
        <IconChart width={28} height={28} />
        <span className="text-orange100 text-14px font-bold font-suite">마음 리포트</span>
      </div>

      {/* 프로필 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={() => {
          nav("/profile");
        }}
      >
        <IconProfile width={28} height={28} />
        <span className="text-cardContent text-14px font-bold font-suite">프로필</span>
      </div>
    </footer>
  );
}

export default Footer;
