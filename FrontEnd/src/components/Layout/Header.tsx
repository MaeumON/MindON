import React from "react";
import IconBack from "@/assets/icons/IconBack";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  isicon: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, isicon, className }) => {
  const nav = useNavigate();
  return (
    <header className={`p-4 ${className}`}>
      {/* isicon이 true일 때만 IconBack을 표시 */}
      {isicon ? (
        <div>
          <div className="grid grid-cols-5">
            <div onClick={() => nav(-1)}>
              <IconBack width={30} height={31} />
            </div>
            <div className="text-20px font-suite font-[700] col-span-3 text-center text-cardTitle">{title}</div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <h1 className="flex text-20px font-suite font-[700] col-span-3 text-center text-cardTitle">{title}</h1>
        </div>
      )}
    </header>
  );
};

export default Header;
