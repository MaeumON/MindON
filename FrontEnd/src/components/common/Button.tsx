interface ButtonProps {
  text: string;
  type: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ text, type, onClick, className, disabled }: ButtonProps) => {
  if (type === "GREEN") {
    return (
      <button
        className={`bg-green100 font-suite rounded-xl py-3 px-4 text-white text-lg font-bold whitespace-nowrap w-full ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (type === "WHITE") {
    return (
      <button
        className={`bg-offWhite font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (type === "ORANGE") {
    return (
      <button
        className={`bg-[#EF945B] font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (type === "GRAY") {
    return (
      <button
        className={`bg-cardContent2 font-suite rounded-xl py-3 px-4 text-cardLongContent text-lg font-bold whitespace-nowrap w-full ${className}`}
        disabled={disabled}
      >
        {text}
      </button>
    );
  }
};

export default Button;
