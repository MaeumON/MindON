import React from "react";
import IconBack from "@/assets/icons/IconBack";

interface HeaderProps {
  title: string;
  isicon: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, isicon }) => {
  return (
    <header className="flex justify-between p-4 bg-white">
      {/* isicon이 true일 때만 IconBack을 표시 */}
      {isicon && <IconBack width={30} height={31} />}
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;
