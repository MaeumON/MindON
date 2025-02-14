import React from "react";

interface InputBoxProps {
  title?: string;
  holder: string;
  titleClassName?: string;
  captionClassName?: string;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  caption?: string;
  maxLength?: number;
}

const InputForm = ({
  title,
  holder,
  titleClassName = "",
  captionClassName = "",
  className = "",
  type = "text",
  value,
  onChange,
  disabled = false,
  caption,
  maxLength,
}: InputBoxProps) => {
  return (
    <div className="flex flex-col gap-3 font-suite font-bold text-xl text-cardTitle">
      <div className="flex justify-between">
        <div className={`${titleClassName}`}>{title}</div>
        <div
          className={`flex items-center text-right text-cardContent2 text-base font-medium font-suite ${captionClassName}`}
        >
          {caption}
        </div>
      </div>
      <input
        type={type}
        className={`grow shrink basis-0 font-suite rounded-xl py-3 px-4 text-cardLongContent
          disabled:text-cardContent disabled:bg-cardSubcontent disabled:cursor-not-allowed  bg-White text-lg justify-start items-center font-medium whitespace-nowrap w-full outline-none border-2 focus:border-yellow100 focus:border-yellow100  focus:ring-0.5 focus:ring-yellow100 ${className} `}
        placeholder={holder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
      ></input>
    </div>
  );
};

export default InputForm;
