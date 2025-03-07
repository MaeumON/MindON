import { IconProps } from "@utils/iconProps";

const IconChat = ({ width, height, fillColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 2.5H22.5V17.5H3.9625L2.5 18.9625V2.5ZM2.5 0C1.125 0 0.0125 1.125 0.0125 2.5L0 25L5 20H22.5C23.875 20 25 18.875 25 17.5V2.5C25 1.125 23.875 0 22.5 0H2.5ZM5 12.5H15V15H5V12.5ZM5 8.75H20V11.25H5V8.75ZM5 5H20V7.5H5V5Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconChat;
