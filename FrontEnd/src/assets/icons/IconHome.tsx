interface IconProps {
  width?: number;
  height?: number;
  fillColor?: string;
  className?: string;
}

const IconHome = ({
  width = 75,
  height = 24,
  fillColor = "cardContent", // ✅ Tailwind 색상 적용
  className = "",
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 75 24"
      fill="none"
      className={`text-${fillColor} ${className}`} // ✅ Tailwind 적용
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.1861 1.21065C37.5472 0.929784 38.0528 0.929784 38.4139 1.21065L47.4139 8.21065C47.6575 8.4001 47.8 8.69141 47.8 9V20C47.8 20.7957 47.4839 21.5587 46.9213 22.1213C46.3587 22.6839 45.5957 23 44.8 23H30.8C30.0044 23 29.2413 22.6839 28.6787 22.1213C28.1161 21.5587 27.8 20.7957 27.8 20V9C27.8 8.69141 27.9425 8.4001 28.1861 8.21065L37.1861 1.21065ZM29.8 9.48908V20C29.8 20.2652 29.9054 20.5196 30.0929 20.7071C30.2804 20.8946 30.5348 21 30.8 21H44.8C45.0652 21 45.3196 20.8946 45.5071 20.7071C45.6947 20.5196 45.8 20.2652 45.8 20V9.48908L37.8 3.26686L29.8 9.48908Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.8 12C33.8 11.4477 34.2477 11 34.8 11H40.8C41.3523 11 41.8 11.4477 41.8 12V22C41.8 22.5523 41.3523 23 40.8 23C40.2477 23 39.8 22.5523 39.8 22V13H35.8V22C35.8 22.5523 35.3523 23 34.8 23C34.2477 23 33.8 22.5523 33.8 22V12Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconHome;
