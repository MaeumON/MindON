import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface GroupsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (selectedFilters: any) => Promise<void>; // 목록 너비 전달받기
}

function GroupsFilter({ isOpen, onClose, onApplyFilter }: GroupsFilterProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(["월"]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]); // 질병 선택 상태
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [maxWidth, setMaxWidth] = useState(412);

  const diseases = [
    "유전 및 희귀 질환",
    "치매",
    "정신건강",
    "대사 및 내분비",
    "심혈관",
    "근골격계",
    "암",
    "피부 및 자가면역",
    "소아청소년",
    "기타",
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const toggleHost = (host: string) => {
    setSelectedHosts((prev) => (prev.includes(host) ? prev.filter((h) => h !== host) : [...prev, host]));
  };

  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) => (prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]));
  };

  useEffect(() => {
    const updateMaxWidth = () => {
      setMaxWidth(Math.min(412, window.innerWidth - 32)); // 화면 너비보다 커지지 않도록 제한
    };

    updateMaxWidth(); // 초기 실행
    window.addEventListener("resize", updateMaxWidth); // 창 크기 변경 감지

    return () => {
      window.removeEventListener("resize", updateMaxWidth); // 클린업
    };
  }, []);

  // 필터 적용하기 버튼 클릭시 실행
  const applyFilter = () => {
    const filterData = {
      diseaseId: selectedDiseases,
      isHost: selectedHosts.length > 0,
      startDate,
      dayOfWeek: selectedDays,
    };

    onApplyFilter(filterData); // 부모 컴포넌트로 전달
    onClose(); // 필터 모달 닫기
  };

  // 필터 초기화하기 버튼 클릭시 실행
  // const resetFilter = () => {
  //   const filterData = {}
  // }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      {/* 배경 블러 처리 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 모달창 (부모 목록과 크기 동기화) */}
      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100vw-32px)] md:max-w-md bg-white rounded-t-xl shadow-lg p-5 max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: `${maxWidth}px` }} // 동적으로 설정된 너비 적용
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-cardTitle">질병</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* 질병 필터 (클릭 가능하도록 설정) */}
        <div className="flex flex-wrap gap-2 mt-3">
          {diseases.map((category) => (
            <button
              key={category}
              onClick={() => toggleDisease(category)}
              className={`p-2 rounded-xl text-sm font-bold border transition ${
                selectedDiseases.includes(category)
                  ? "bg-green100 text-white border-green100"
                  : "bg-white text-gray-600 border-cardSubcontent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 구분선 */}
        <hr className="my-3 border-cardSubcontent" />

        {/* 기간 및 시작 날짜 간격 조정 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-cardTitle">기간</span>
            <select className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg">
              <option>1주</option>
              <option>2주</option>
              <option>3주</option>
              <option>4주</option>
              <option>5주</option>
              <option>6주</option>
              <option>7주</option>
              <option>8주</option>
            </select>
          </div>

          {/* 캘린더 입력 */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-cardTitle">시작 날짜</span>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg w-28"
              dateFormat="yy-MM-dd"
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // 내일부터 선택 가능
            />
          </div>
        </div>

        {/* 요일 선택 */}
        <div className="mt-4">
          <span className="text-lg font-bold text-cardTitle">요일</span>
          <div className="flex gap-2 mt-2">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <button
                key={day}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  selectedDays.includes(day) ? "bg-green100 text-white" : "bg-cardSubcontent text-cardLongContent"
                }`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 선택 */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-bold text-cardTitle">시간</span>
          <select className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg">
            <option>18:00</option>
          </select>
          <span className="text-lg font-bold">~</span>
          <select className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg">
            <option>20:00</option>
          </select>
        </div>

        {/* 진행자 선택 */}
        <div className="mt-4">
          <span className="text-lg font-bold text-cardTitle">진행자</span>
          <div className="flex gap-4 mt-2">
            {["유", "무", "관계 없음"].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-6 h-6 border border-gray-400 rounded-md transition-all "
                  checked={selectedHosts.includes(option)}
                  onChange={() => toggleHost(option)}
                />
                <span className="text-lg font-bold text-cardTitle">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-5 mt-6">
          <button className="px-4 py-3 border border-cardSubcontent rounded-xl text-gray-600 font-bold">
            초기화하기
          </button>
          <button onClick={applyFilter} className="px-4 py-3 bg-green100 text-white rounded-xl font-bold">
            적용하기
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default GroupsFilter;
