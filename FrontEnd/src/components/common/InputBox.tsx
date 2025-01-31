interface InputBoxProps {
  text: string;
}

const InputBox = ({ text }: InputBoxProps) => {
  return (
    <div>
      <input
        className="grow shrink basis-0 font-suite rounded-xl py-3 px-4 text-cardLongContent bg-White text-lg justify-start items-center font-bold whitespace-nowrap w-full outline-none border-2 focus:border-yellow100 focus:border-yellow100  focus:ring-0.5 focus:ring-yellow100"
        placeholder={text}
      ></input>
    </div>
  );
};

export default InputBox;
