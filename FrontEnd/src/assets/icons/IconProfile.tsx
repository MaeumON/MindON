import { IconProps } from "@utils/iconProps";

const IconProfile = ({ width = 24, height = 24, fillColor = "cardContent", className = "" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={`text-${fillColor} ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.46447 15.4645C5.40215 14.5268 6.67392 14 8 14H16C17.3261 14 18.5979 14.5268 19.5355 15.4645C20.4732 16.4021 21 17.6739 21 19V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V19C19 18.2044 18.6839 17.4413 18.1213 16.8787C17.5587 16.3161 16.7956 16 16 16H8C7.20435 16 6.44129 16.3161 5.87868 16.8787C5.31607 17.4413 5 18.2044 5 19V21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21V19C3 17.6739 3.52678 16.4021 4.46447 15.4645Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconProfile;
