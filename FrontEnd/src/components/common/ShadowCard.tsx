import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode; // children은 ReactNode 타입
  className?: string; // className은 선택적인 string 타입
  style?: CSSProperties; // style은 선택적인 CSSProperties 타입
  onClick?: () => void;
}

const Card = ({ children, className = "", style = {}, onClick }: CardProps) => {
  return (
    <section
      className={`flex flex-col justify-center ${className} ${onClick ? "cursor-pointer" : ""}`}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined} // ✅ 접근성 추가
      tabIndex={onClick ? 0 : undefined}
    >
      <section className="bg-white rounded-[12px] shadow-md p-5 w-[330px]">
        <div className="flex flex-col gap-[10px]">{children}</div>
      </section>
    </section>
  );
};

export default Card;
