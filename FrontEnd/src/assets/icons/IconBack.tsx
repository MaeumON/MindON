import { IconProps } from "@utils/iconProps";

const IconBack = ({ width = 30, height = 31, fillColor = "none", className = "" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 30 31"
      fill="none"
      className={`text-${fillColor} ${className}`}
    >
      <path
        d="M19.2485 7.25195L11.1685 15.3603L19.2485 23.4686"
        stroke="#828282"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconBack;
