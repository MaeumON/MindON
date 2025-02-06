import { IconProps } from "@utils/iconProps";

const IconArrowRight = ({ width = 30, height = 31, fillColor = "none", className = "" }: IconProps) => {
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
        d="M10.752 7.19873L18.832 15.3071L10.752 23.4154"
        stroke="#828282"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconArrowRight;
