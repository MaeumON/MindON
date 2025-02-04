interface IconProps {
  width?: number;
  height?: number;
  fillColor?: string;
  className?: string;
}

const IconHome = ({
  width = 25, // 기본 크기 설정
  height = 24,
  fillColor = "#828282", // 기본 색상 설정
  className = "",
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 24" // ✅ 원본 SVG의 viewBox 유지
      fill="none"
      className={className} // Tailwind 클래스 적용 가능
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.1861 1.21065C12.5472 0.929784 13.0529 0.929784 13.414 1.21065L22.414 8.21065C22.6575 8.4001 22.8 8.69141 22.8 9V20C22.8 20.7957 22.484 21.5587 21.9213 22.1213C21.3587 22.6839 20.5957 23 19.8 23H5.80002C5.00437 23 4.24131 22.6839 3.6787 22.1213C3.11609 21.5587 2.80002 20.7957 2.80002 20V9C2.80002 8.69141 2.94249 8.4001 3.18608 8.21065L12.1861 1.21065ZM4.80002 9.48908V20C4.80002 20.2652 4.90538 20.5196 5.09292 20.7071C5.28045 20.8946 5.53481 21 5.80002 21H19.8C20.0652 21 20.3196 20.8946 20.5071 20.7071C20.6947 20.5196 20.8 20.2652 20.8 20V9.48908L12.8 3.26686L4.80002 9.48908Z"
        fill={fillColor} // ✅ fillColor 적용 가능
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.80002 12C8.80002 11.4477 9.24773 11 9.80002 11H15.8C16.3523 11 16.8 11.4477 16.8 12V22C16.8 22.5523 16.3523 23 15.8 23C15.2477 23 14.8 22.5523 14.8 22V13H10.8V22C10.8 22.5523 10.3523 23 9.80002 23C9.24773 23 8.80002 22.5523 8.80002 22V12Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconHome;
