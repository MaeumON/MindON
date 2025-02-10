import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RequestData } from "@/utils/groups";
import RadioButton from "../common/RadioButton";

interface GroupsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (selectedFilters: RequestData) => Promise<void>;
}

function GroupsFilter({ isOpen, onClose, onApplyFilter }: GroupsFilterProps) {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]); // 질병 선택 상태
  const [selectedPeriod, setSelectedPeriod] = useState<number>(); // 기본값 1주
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("00:00");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("23:00");
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [maxWidth, setMaxWidth] = useState(412);

  // 반응형 화면 구현
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

  // 숫자 요일로 변환
  const dayMap: Record<string, number> = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
    일: 7,
  };

  // 필터 표시용 질병
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

  // 질병 이름을 ID로 변환
  const diseaseMap = {
    "유전 및 희귀 질환": 1,
    치매: 2,
    정신건강: 3,
    "대사 및 내분비": 4,
    심혈관: 5,
    근골격계: 6,
    암: 7,
    "피부 및 자가면역": 8,
    소아청소년: 9,
    기타: 10,
  } as Record<string, number>;

  // 질병 선택 시 토글
  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) => (prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]));
  };

  // 요일 선택 시 토글
  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  //  진행자 선택 (라디오 버튼처럼 동작)
  const toggleHost = (host: string) => {
    setSelectedHost(host === "관계 없음" ? null : host);
  };

  // 필터 적용하기 버튼 클릭 시 실행
  const applyFilter = () => {
    // 현재 날짜 이용하여 시간 변환

    const startDateObj = startDate ? new Date(startDate) : new Date();

    const formattedStartDate = new Date(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate(), // ✅ 연, 월, 일만 설정하고 시간은 00:00:00
      0,
      0,
      0
    );

    const formattedStartDateString = formattedStartDate.toISOString().split("T")[0] + "T00:00:00Z";

    const filterData: RequestData = {
      diseaseId: selectedDiseases.map((disease) => diseaseMap[disease] || null).filter((id) => id !== null),
      isHost: selectedHost === "유" ? true : selectedHost === "무" ? false : null,
      startDate: formattedStartDateString,
      period: selectedPeriod,
      startTime: Number(selectedStartTime.split(":")[0]),
      endTime: Number(selectedEndTime.split(":")[0]),
      dayOfWeek: selectedDays.map((day) => dayMap[day] ?? null).filter((id) => id !== null),
    };
    console.log("FilterData : ", filterData);
    onApplyFilter(filterData);
    onClose();
  };
  // 필터 초기화하기 버튼 클릭시 실행
  const resetFilter = () => {
    setSelectedDays([]);
    setSelectedHost(null);
    setSelectedDiseases([]);
    setStartDate(new Date());
    setSelectedPeriod(1);
    setSelectedStartTime("00:00");
    setSelectedEndTime("23:00");
  };

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

        {/* 기간 선택*/}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-cardTitle">기간</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg"
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}주
                </option>
              ))}
            </select>
          </div>

          {/* 시작날짜 캘린더 입력 */}
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

          {/* 시작 시간 선택 */}
          <select
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
            className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg"
          >
            {[...Array(24)].map((_, i) => {
              const hour = String(i).padStart(2, "0"); // 00, 01, 02, ... 23
              return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
            })}
          </select>

          <span className="text-lg font-bold">~</span>

          {/* 종료 시간 선택 */}
          <select
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
            className="px-3 py-2 border border-cardSubcontent rounded-xl text-lg"
          >
            {[...Array(24)].map((_, i) => {
              const hour = String(i).padStart(2, "0"); // 00, 01, 02, ... 23
              return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
            })}
          </select>
        </div>
        {/* 진행자 선택 */}
        <div className="mt-4">
          <span className="text-lg font-bold text-cardTitle">진행자</span>
          <div className="flex gap-4 mt-2">
            {["유", "무", "관계 없음"].map((option) => (
              <RadioButton
                key={option}
                name="host"
                value={option}
                checked={selectedHost === option}
                onChange={() => toggleHost(option)}
              >
                {option}{" "}
              </RadioButton>
            ))}{" "}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-5 mt-6">
          <button
            onClick={resetFilter}
            className="px-4 py-3 border border-cardSubcontent rounded-xl text-gray-600 font-bold"
          >
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
