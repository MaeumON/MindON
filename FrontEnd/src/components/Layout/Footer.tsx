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
      className="flex justify-around items-center shadow-md fixed bottom-0 h-[74px] bg-white w-full max-w-[412px] mx-auto pt-1 px-1"
      style={{ zIndex: 99999 }}
    >
      {/* 홈 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer w-[50px]"
        onClick={() => handleFooterClick("/main")}
      >
        <IconHome width={30} height={30} fillColor={currentPath === "/main" ? "#DA8600" : "#9D9D9D"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/main" ? "text-orange100" : "text-cardContent2"}`}
        >
          홈
        </span>
      </div>

      {/* 모임 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer w-[50px]"
        onClick={() => handleFooterClick("/groupslist?page=1&size=10&sort=startDate,asc")}
      >
        <IconPeople width={40} height={30} fillColor={currentPath === "/groupslist" ? "orange100" : "cardContent2"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/groupslist" ? "text-orange100" : "text-cardContent2"}`}
        >
          모임
        </span>
      </div>

      {/* 중앙 버튼 */}
      <div
        className="flex items-center justify-center w-[65px] h-[65px] bg-orange100 rounded-full shadow-md -translate-y-2 cursor-pointer"
        onClick={() => handleFooterClick("/creategroup")}
      >
        <IconPlus width={120} height={120} />
      </div>

      {/* 마이데이터 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer w-[50px]"
        onClick={() => handleFooterClick("/mydata")}
      >
        <IconChart width={30} height={30} fillColor={currentPath === "/mydata" ? "orange100" : "cardContent2"} />
        <span
          className={`whitespace-nowrap text-14px font-bold font-suite ${currentPath === "/mydata" ? "text-orange100" : "text-cardContent2"}`}
        >
          마음리포트
        </span>
      </div>

      {/* 프로필 버튼 */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer w-[50px] whitespace-nowrap"
        onClick={() => handleFooterClick("/mypage")}
      >
        <IconProfile width={30} height={30} fillColor={currentPath === "/mypage" ? "orange100" : "cardContent2"} />
        <span
          className={`text-14px font-bold font-suite ${currentPath === "/mypage" ? "text-orange100" : "text-cardContent2"}`}
        >
          마이페이지
        </span>
      </div>
    </footer>
  );
}

export default Footer;
