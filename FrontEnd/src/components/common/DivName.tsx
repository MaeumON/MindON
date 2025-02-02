import React from "react";

// 가독성을 위해 만든 컴포넌트
// div가 너무 많아 영역 구분이 어려워서 만듦

interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

// 전체 코드 감싸기(가운데정렬, 폰트, 높이 자동, 너비 full)
export const Wrapper = ({ children, className = "" }: FrameProps) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full font-suite min-h-screen ${className}`}>
      {children}
    </div>
  );
};

// 입력을 받는 부분
export const Form = ({ children, className = "" }: FrameProps) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};

// 글씨가 써있는 영역(왼쪽정렬)
export const TextSection = ({ children, className = "" }: FrameProps) => {
  return <div className={`flex flex-col justify-start gap-2 ${className}`}>{children}</div>;
};
