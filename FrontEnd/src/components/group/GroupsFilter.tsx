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
  selectedFilters: RequestData;
}

function GroupsFilter({ isOpen, onClose, onApplyFilter, selectedFilters }: GroupsFilterProps) {
  const [maxWidth, setMaxWidth] = useState(412);

  // ✅ 카테고리 변환
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

  // ✅ 초기값을 부모에서 받은 selectedFilters로 설정
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(
    selectedFilters.diseaseId
      ? selectedFilters.diseaseId.map((id) => Object.keys(diseaseMap).find((key) => diseaseMap[key] === id) || "")
      : []
  );
  const [selectedPeriod, setSelectedPeriod] = useState<number>(selectedFilters.period ?? 0);
  const [startDate, setStartDate] = useState<Date | null>(
    selectedFilters.startDate ? new Date(selectedFilters.startDate) : new Date()
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    selectedFilters.dayOfWeek
      ? selectedFilters.dayOfWeek.map((day) => Object.keys(dayMap).find((key) => dayMap[key] === day) || "")
      : []
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string>(
    selectedFilters.startTime ? `${selectedFilters.startTime}:00` : "00:00"
  );
  const [selectedEndTime, setSelectedEndTime] = useState<string>(
    selectedFilters.endTime ? `${selectedFilters.endTime}:00` : "23:00"
  );
  const [selectedHost, setSelectedHost] = useState<string | null>(
    selectedFilters.isHost === true ? "유" : selectedFilters.isHost === false ? "무" : null
  );

  // ✅ 반응형 화면 구현
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

  // ✅ 모달이 열릴 때 기존 필터 값을 반영
  useEffect(() => {
    if (isOpen) {
      setSelectedDiseases(
        selectedFilters.diseaseId
          ? selectedFilters.diseaseId.map((id) => Object.keys(diseaseMap).find((key) => diseaseMap[key] === id) || "")
          : []
      );
      setSelectedPeriod(selectedFilters.period ?? 0);
      setStartDate(selectedFilters.startDate ? new Date(selectedFilters.startDate) : new Date());
      setSelectedDays(
        selectedFilters.dayOfWeek
          ? selectedFilters.dayOfWeek.map((day) => Object.keys(dayMap).find((key) => dayMap[key] === day) || "")
          : []
      );
      setSelectedStartTime(selectedFilters.startTime ? `${selectedFilters.startTime}:00` : "00:00");
      setSelectedEndTime(selectedFilters.endTime ? `${selectedFilters.endTime}:00` : "23:00");
      setSelectedHost(selectedFilters.isHost === true ? "유" : selectedFilters.isHost === false ? "무" : null);
    }
  }, [isOpen, selectedFilters]);

  // ✅버튼
  // 필터 적용하기 버튼 클릭 시 실행
  const applyFilter = () => {
    const startDateObj = startDate ? new Date(startDate) : new Date();
    startDateObj.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정 (로컬 시간 유지)

    // YYYY-MM-DD 형식으로 변환 (UTC 변환 없이 로컬 시간 유지)
    const year = startDateObj.getFullYear();
    const month = String(startDateObj.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1
    const day = String(startDateObj.getDate()).padStart(2, "0");

    const formattedStartDateString = `${year}-${month}-${day}T00:00:00Z`;

    // const formattedStartDateString = formattedStartDate.toISOString().split("T")[0] + "T00:00:00Z";
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
  function resetFilter() {
    setSelectedDays([]);
    setSelectedHost(null);
    setSelectedDiseases([]);
    setStartDate(new Date());
    setSelectedPeriod(0);
    setSelectedStartTime("00:00");
    setSelectedEndTime("23:00");
  }

  // 질병 토글
  function toggleDisease(disease: string) {
    setSelectedDiseases((prev) => (prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]));
  }

  // 요일 토글
  function toggleDay(day: string) {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  //  진행자 토글 (라디오 버튼처럼 동작)
  function toggleHost(host: string) {
    setSelectedHost(host);
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0" style={{ zIndex: 99999 }}>
      {/* 배경 블러 처리 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 모달창 (부모 목록과 크기 동기화) */}
      <div
        className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[412px] bg-white rounded-t-xl shadow-lg p-5 max-h-[90vh] overflow-y-auto"
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
              onChange={(e) => setSelectedPeriod(e.target.value === "1~8주" ? 0 : Number(e.target.value))}
              className="px-3 py-2 border border-cardSubcontent rounded-xl text-md text-suite"
            >
              <option value="1~8주">{"1~8주"}</option>
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
