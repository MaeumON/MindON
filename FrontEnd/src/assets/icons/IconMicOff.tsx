import { IconProps } from "@utils/iconProps";

const IconMicOff = ({ width, height, fillColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 18H28.6C28.6 19.48 28.28 20.86 27.74 22.1L30.2 24.56C31.32 22.6 32 20.38 32 18ZM23.96 18.34C23.96 18.22 24 18.12 24 18V6C24 2.68 21.32 0 18 0C14.68 0 12 2.68 12 6V6.36L23.96 18.34ZM2.54 2L0 4.54L12.02 16.56V18C12.02 21.32 14.68 24 18 24C18.44 24 18.88 23.94 19.3 23.84L22.62 27.16C21.2 27.82 19.62 28.2 18 28.2C12.48 28.2 7.4 24 7.4 18H4C4 24.82 9.44 30.46 16 31.44V38H20V31.44C21.82 31.18 23.54 30.54 25.08 29.64L33.46 38L36 35.46L2.54 2Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconMicOff;
