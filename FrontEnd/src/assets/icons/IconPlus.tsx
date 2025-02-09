import { IconProps } from "@utils/iconProps";

const IconPlus = ({ width = 100, height = 100, fillColor = "orange100", className = "" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 78 50"
      fill="none"
      className={`text-${fillColor} ${className}`}
    >
      <rect x="14" width="50" height="50" rx="25" fill="currentColor" />
      <path d="M41.2 14H36.8V22.8H28V27.2H36.8V36H41.2V27.2H50V22.8H41.2V14Z" fill="white" />
    </svg>
  );
};

export default IconPlus;
