interface IconProps {
  width?: number;
  height?: number;
  fillColor?: string;
  className?: string;
}

const IconChart = ({ width = 25, height = 24, fillColor = "orange100", className = "" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      className={`text-${fillColor} ${className}`}
    >
      <path
        d="M3.18589 7.34458H3.5258C4.83444 7.34458 5.90515 8.41528 5.90515 9.72392V21.6206C5.90515 22.9293 4.83444 24 3.5258 24H3.18589C1.87725 24 0.806549 22.9293 0.806549 21.6206V9.72392C0.806549 8.41528 1.87725 7.34458 3.18589 7.34458ZM12.7033 0.206543C14.0119 0.206543 15.0826 1.27725 15.0826 2.58589V21.6206C15.0826 22.9293 14.0119 24 12.7033 24C11.3946 24 10.3239 22.9293 10.3239 21.6206V2.58589C10.3239 1.27725 11.3946 0.206543 12.7033 0.206543ZM22.2207 13.8028C23.5293 13.8028 24.6 14.8735 24.6 16.1821V21.6206C24.6 22.9293 23.5293 24 22.2207 24C20.912 24 19.8413 22.9293 19.8413 21.6206V16.1821C19.8413 14.8735 20.912 13.8028 22.2207 13.8028Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconChart;
