import React from "react";

interface FrameProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: FrameProps) => {
  return <div className="flex flex-col items-center justify-center h-screen w-full">{children}</div>;
};

export const Form = ({ children }: FrameProps) => {
  return <div className="flex h-[100%]">{children}</div>;
};
