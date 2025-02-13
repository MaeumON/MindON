import { IconProps } from "@utils/iconProps";

const IconCamOff = ({ width, height, fillColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M38 9L30 17V10C30 8.9 29.1 8 28 8H15.64L38 30.36V9ZM2.54 0L0 2.54L5.46 8H4C2.9 8 2 8.9 2 10V30C2 31.1 2.9 32 4 32H28C28.42 32 28.78 31.84 29.08 31.64L35.46 38L38 35.46L2.54 0Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconCamOff;
