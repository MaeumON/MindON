import React from "react";

interface ButtonProps {
  text: string;
  type: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const Button = ({ text, type, onClick, className, disabled, onKeyDown }: ButtonProps) => {
  if (type === "GREEN") {
    return (
      <button
        className={`bg-green100 font-suite rounded-xl py-3 px-4 text-white text-lg font-bold whitespace-nowrap w-full ${className}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {text}
      </button>
    );
  } else if (type === "WHITE") {
    return (
      <button
        className={` ${className} bg-offWhite font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full`}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {text}
      </button>
    );
  } else if (type === "ORANGE") {
    return (
      <button
        className={`bg-[#EF945B] font-suite rounded-xl py-3 px-4 text-white text-lg font-bold whitespace-nowrap w-full ${className}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {text}
      </button>
    );
  } else if (type === "GRAY") {
    return (
      <button
        className={`bg-cardContent2 font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full ${className}`}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {text}
      </button>
    );
  }
};

export default Button;
