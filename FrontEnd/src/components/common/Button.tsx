interface ButtonProps {
  text: string;
  type: string;
}

const Button = ({ text, type }: ButtonProps) => {
  if (type === "Green") {
    return (
      <button className="bg-green100 font-suite rounded-xl py-3 px-4 text-white text-lg font-bold whitespace-nowrap w-full">
        {text}
      </button>
    );
  } else if (type === "White") {
    return (
      <button className="bg-offWhite font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full">
        {text}
      </button>
    );
  }
};

export default Button;
