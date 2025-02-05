import React from "react";
import IconBack from "@/assets/icons/IconBack";

interface HeaderProps {
  title: string;
  isicon: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, isicon }) => {
  return (
    <header className="p-4 bg-white">
      {/* isicon이 true일 때만 IconBack을 표시 */}
      {isicon ? (
        <div>
          <div className="grid grid-cols-5">
            <div>
              <IconBack className="" width={30} height={31} />
            </div>
            <div className="text-20px font-bold col-span-3 text-center">{title}</div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <h1 className="flex text-20px font-bold">{title}</h1>
        </div>
      )}
    </header>
  );
};

export default Header;
