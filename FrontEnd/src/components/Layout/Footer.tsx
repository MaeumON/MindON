import IconHome from "@/assets/icons/IconHome";
import IconPeople from "@/assets/icons/IconPeople";
import IconChart from "@/assets/icons/IconChart";
import IconPlus from "@/assets/icons/IconPlus";
import IconProfile from "@/assets/icons/IconProfile";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Footer() {
  const nav = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleFooterClick = (path: string) => {
    setCurrentPath(path);
    nav(path);
  };

  return (
    <footer
      className="flex justify-around items-center shadow-md fixed bottom-0 h-[74px] bg-white w-full max-w-[412px] mx-auto px-4"
      style={{ zIndex: 99999 }}
    >
      {/* 홈 버튼 */}
      <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => handleFooterClick("/main")}>
        <IconHome width={28} height={28} fillColor={currentPath === "/main" ? "#DA8600" : "#828282"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/main" ? "text-orange100" : "text-cardContent2"}`}
        >
          홈
        </span>
      </div>

      {/* 모임 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={() => handleFooterClick("/groupslist")}
      >
        <IconPeople width={32} height={32} fillColor={currentPath === "/groupslist" ? "orange100" : "cardContent2"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/groupslist" ? "text-orange100" : "text-cardContent2"}`}
        >
          모임
        </span>
      </div>

      {/* 중앙 버튼 */}
      <div
        className="flex items-center justify-center w-[60px] h-[60px] bg-orange100 rounded-full shadow-md -translate-y-2 cursor-pointer"
        onClick={() => handleFooterClick("/createroom")}
      >
        <IconPlus width={100} height={100} />
      </div>

      {/* 마이데이터 버튼 */}
      <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => handleFooterClick("/mydata")}>
        <IconChart width={28} height={28} fillColor={currentPath === "/mydata" ? "orange100" : "cardContent2"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/mydata" ? "text-orange100" : "text-cardContent2"}`}
        >
          마음 리포트
        </span>
      </div>

      {/* 프로필 버튼 */}
      <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => handleFooterClick("/mypage")}>
        <IconProfile width={28} height={28} fillColor={currentPath === "/profile" ? "orange100" : "cardContent2"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/profile" ? "text-orange100" : "text-cardContent2"}`}
        >
          마이페이지
        </span>
      </div>
    </footer>
  );
}

export default Footer;
