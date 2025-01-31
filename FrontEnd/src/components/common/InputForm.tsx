interface InputBoxProps {
  title: string;
  holder: string;
  titleClassName?: string;
  className?: string;
  type?: string;
}

const InputForm = ({ title, holder, titleClassName = "", className = "", type = "text" }: InputBoxProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className={`${titleClassName}`}>{title}</div>
      <input
        type={type}
        className={`grow shrink basis-0 font-suite rounded-xl py-3 px-4 text-cardLongContent bg-White text-lg justify-start items-center font-bold whitespace-nowrap w-full outline-none border-2 focus:border-yellow100 focus:border-yellow100  focus:ring-0.5 focus:ring-yellow100 ${className}`}
        placeholder={holder}
      ></input>
    </div>
  );
};

export default InputForm;
