interface IconProps {
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
}

const IconSearch = ({
  width = 21,
  height = 20,
  fillColor = "cardContent",
  strokeColor = "cardContent",
  className = "",
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      className={`text-${fillColor} stroke-${strokeColor} ${className}`}
    >
      <path
        d="M18.53 16.69l-3.67-3.69c0.9-1.18 1.44-2.66 1.44-4.26C16.3 4.88 13.18 1.75 9.34 1.75S2.39 4.88 2.39 8.74c0 3.86 3.11 6.99 6.95 6.99 1.59 0 3.06-0.54 4.23-1.44l3.67 3.69c0.36 0.36 0.94 0.36 1.3 0 0.36-0.36 0.36-0.94 0-1.3zM9.34 13.89c-2.82 0-5.12-2.31-5.12-5.15 0-2.84 2.31-5.15 5.12-5.15 2.82 0 5.12 2.31 5.12 5.15 0 2.84-2.31 5.15-5.12 5.15z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default IconSearch;
