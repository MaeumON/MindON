import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";

// Chart.js 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface CircularChartProps {
  percentage: number; // 퍼센트를 받기 위한 props
  // width?: number;
  // height?: number;
}

const CircularChart: React.FC<CircularChartProps> = ({ percentage }) => {
  // 차트 데이터 설정
  const data = {
    labels: ["발화량"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#C5E1A5", "#ffffff"], // 초록색과 회색
        borderWidth: 5, // 차트 선 두께
        borderRadius: 20, // 원형 차트 모서리 둥글게
        cutout: "60%", // 중앙 비우기 (도넛 형태)
      },
    ],
  };

  // 차트 옵션 설정
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // 범례 표시
        position: "right" as const, // "top", "left", "right", "bottom", "center"로 설정
        labels: {
          usePointStyle: true,
          font: {
            family: "jamsilBold", // 사용자 지정 폰트
            size: 16, // 폰트 크기
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.raw}%`; // 툴팁에 퍼센트 값 표시
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0, // 원형 차트 안쪽 경계선 제거
        borderRadius: 50, // 원형 모서리 둥글게
      },
    },
  };

  return (
    <div className="circular-chart-container flex justify-center">
      <div className="relative">
        {/* 퍼센트 값 차트의 정중앙에 표시 */}
        <div className="percentage-label font-jamsilMedium text-24px absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2 ">
          {percentage}%
        </div>
        <Doughnut data={data} options={options} className="sm:w-[250px] w-[220px]" height="200" />
      </div>
    </div>
  );
};

export default CircularChart;
