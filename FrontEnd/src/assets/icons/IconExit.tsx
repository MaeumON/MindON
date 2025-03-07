import { IconProps } from "@utils/iconProps";

const IconExit = ({ width, height, className }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 0C8.94 0 0 8.94 0 20C0 31.06 8.94 40 20 40C31.06 40 40 31.06 40 20C40 8.94 31.06 0 20 0ZM30 27.18L27.18 30L20 22.82L12.82 30L10 27.18L17.18 20L10 12.82L12.82 10L20 17.18L27.18 10L30 12.82L22.82 20L30 27.18Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconExit;
