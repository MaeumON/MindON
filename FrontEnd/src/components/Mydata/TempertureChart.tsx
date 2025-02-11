import { useRef, useState, useEffect } from "react";
import { fetchTemperature } from "@/apis/temperture"; // API 호출 함수 사용

interface TempertureChartProps {
  username: string;
}

const TempertureChart = ({ username }: TempertureChartProps) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [pointPosition, setPointPosition] = useState({ cx: 100, cy: 180 });
  const [temperture, setTemperture] = useState(40); // 기본 값 40°C
  const [currentTemp, setCurrentTemp] = useState(0); // 초기 온도 0으로 설정

  useEffect(() => {
    const loadTemperature = async () => {
      try {
        const temperaturedata = await fetchTemperature();
        setTemperture(temperaturedata);
        console.log(temperture);
      } catch (error) {
        console.log("온도 불러오기 실패", error);
      }
    };
    loadTemperature();
  }, []); // 렌더링 할 때만 실행

  // Path 길이 가져오기
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength()); // 경로의 전체 길이를 계산
    }
  }, []);

  // 온도 값에 비례하여 점을 3도씩 이동하도록 설정
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTemp < temperture) {
        setCurrentTemp((prevTemp) => Math.min(prevTemp + 1, temperture)); // 1도씩 증가
      }
    }, 20); // 100ms 간격으로 온도값을 1도씩 증가

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 클리어
  }, [temperture, currentTemp]);

  // 점의 위치를 계산하여 업데이트
  useEffect(() => {
    if (pathRef.current && currentTemp <= temperture) {
      const progress = (currentTemp / 100) * pathLength; // 온도에 비례해서 위치 변경
      const point = pathRef.current.getPointAtLength(progress); // 해당 길이에서 좌표 가져오기
      setPointPosition({ cx: point.x, cy: point.y }); // 점의 위치 업데이트
    }
  }, [currentTemp, pathLength]); // `currentTemp`가 변경될 때마다 점 위치 업데이트

  let warmtitle: string = "OFF";
  if (temperture >= 50) {
    warmtitle = "뜨끈한 온돌";
  } else if (temperture >= 30) {
    warmtitle = "따뜻한 핫팩";
  } else {
    warmtitle = "데워지는 중";
  }

  return (
    <div className="relative w-full">
      {/* SVG 애니메이션 */}
      <div className="w-full h-50 flex flex-col items-center">
        <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-full">
          {/* 🔹 그라데이션 호 */}
          <defs>
            <linearGradient id="temperature-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="10%" style={{ stopColor: "#C5E1A5", stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: "#F8D893", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#DA8600", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* 🔹 호 (두꺼운 그라디언트 선) */}
          <path
            ref={pathRef}
            d="M80 400 A180, 180 0 0, 1 720 400"
            stroke="url(#temperature-gradient)"
            strokeWidth="120"
            fill="none"
            strokeLinecap="square"
          />

          {/* 🔹 움직이는 점 (온도 값에 따라 움직임) */}
          <circle
            r="20"
            fill="white"
            cx={pointPosition.cx} // 동적으로 계산된 cx 값
            cy={pointPosition.cy} // 동적으로 계산된 cy 값
          />
        </svg>
        {/* 중앙 텍스트 (온도 표시) */}
        <div
          className="text-cardContent text-36px font-jamsilMedium mt-[-55px]" // 스타일 적용
        >
          {temperture}°C
        </div>
        {/* 기존 컨텐츠 */}
        <div className="flex flex-col items-center mt-3">
          <div className="font-suite font-regular text-22px">{username}님의 마음은</div>
          <div className="font-suite font-extrabold text-22px">{warmtitle}</div>
        </div>
      </div>
    </div>
  );
};

export default TempertureChart;
