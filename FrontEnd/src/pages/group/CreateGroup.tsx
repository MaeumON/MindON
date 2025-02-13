import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";
import DiseaseDrop from "@/components/common/DiseaseDrop";
import Button from "@/components/common/Button";
import IconExit from "@assets/icons/IconExit";
import InputForm from "@/components/common/InputForm";
import RadioButton from "@/components/common/RadioButton";
import DatePicker from "react-datepicker";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const today = new Date();
  const [diseaseId, setDiseaseId] = useState<number | null>(null);
  const nav = useNavigate();
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [selectedPeriod, setSelectedPeriod] = useState<string>("6주");
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(today); // ✅ DatePicker에서 사용할 상태값

  // const [startDate, setStartDate] = useState<string>(formattedToday);

  const [selectedDay, setSelectedDay] = useState<string>(""); // 요일 단일 선택으로 변경경
  const [selectedStartTime, setSelectedStartTime] = useState<string>("18:00");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("20:00");

  // ✅ DatePicker 날짜 선택 핸들러
  const handleDateChange = (date: Date | null) => {
    setSelectedStartDate(date || today);
  };

  // ✅ 요일 선택을 하나만 가능하도록 수정
  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
  };

  const [minMembers, setMinMembers] = useState<string>("2");
  const [maxMembers, setMaxMembers] = useState<string>("8");

  const [selectedHost, setSelectedHost] = useState<string>("유");
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>("유");

  function handleCloseModal() {
    nav(-1);
  }

  return (
    <div>
      <Header title="모임 만들기" isicon={true} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="w-[85%] bg-offWhite rounded-[12px] p-5">
          {/* 닫기 버튼 */}
          <div onClick={handleCloseModal} className="flex justify-end mb-2">
            <IconExit width={20} height={20} fillColor="" />
          </div>
          {/* 모임 관련련 */}
          {/* 입력 폼 */}
          <div className="flex flex-col gap-4">
            <InputForm
              title="모임명"
              titleClassName="text-xl"
              holder="모임명을 입력해주세요."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              caption="10자 이하"
            />
            <div>
              <textarea
                className="resize-none font-suite rounded-[12px] py-3 px-4 text-cardLongContent
              disabled:text-cardContent disabled:bg-cardSubcontent disabled:cursor-not-allowed bg-White text-18px w-full outline-none border-2 focus:border-yellow100 focus:ring-0.5 focus:ring-yellow100 min-h-[3rem] max-h-[15rem] overflow-hidden"
                placeholder="모임에 대해 간단히 소개해주세요."
                rows={2}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>

            {/* 질병 선택 */}
            <DiseaseDrop title="질병" value={diseaseId} onSelect={setDiseaseId} />

            {/* 기간 및 시작 날짜 */}
            <div className="flex justify-between">
              <span className="flex items-center font-suite whitespace-nowrap text-xl font-bold text-cardTitle">
                기간
              </span>
              <select
                className="text-center border border-cardSubcontent rounded-xl text-lg font-suite text-cardTitle"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="1~8주">{"1~8주"}</option>
                {[...Array(8)].map((_, i) => (
                  <option className="text-lg font-suite" key={i + 1} value={i + 1}>
                    {i + 1}주
                  </option>
                ))}
              </select>

              {/* ✅ 시작날짜 캘린더 입력 수정 */}
              <div className="flex items-center gap-2">
                <span className="font-suite whitespace-nowrap text-xl font-[600] text-cardTitle">시작날짜</span>
                <DatePicker
                  selected={selectedStartDate}
                  onChange={handleDateChange}
                  className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle text-lg w-28"
                  dateFormat="yy-MM-dd"
                  minDate={today} // ✅ 오늘 이후 날짜만 선택 가능하도록 설정
                />
              </div>
            </div>

            {/* 요일 선택 */}
            <div className="">
              <span className="font-suite text-cardTitle text-xl font-bold">요일</span>
              <div className="font-suite text-cardTitle text-xl font-bold flex gap-2 mt-2">
                {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                  <button
                    key={day}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      selectedDay === day ? "bg-green100 text-white" : "bg-cardSubcontent text-cardLongContent"
                    }`}
                    onClick={() => handleDaySelection(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 시간 선택 */}
            <div className="flex items-center gap-2">
              <span className="font-suite text-cardTitle text-xl font-bold">시간</span>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                ))}
              </select>
              <span className="text-lg font-bold">~</span>
              <select
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                ))}
              </select>
            </div>

            {/* ✅ 인원 선택 */}
            <div className="">
              <div className="flex items-center gap-2">
                <span className="font-suite text-cardTitle text-xl font-bold whitespace-nowrap">인원</span>
                <div className="flex items-center gap-2">
                  <span className="font-suite text-lg whitespace-nowrap text-cardContent ">최소</span>
                  <select
                    value={minMembers}
                    onChange={(e) => setMinMembers(e.target.value)}
                    className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                  <span className=" text-cardContent  font-suite text-lg whitespace-nowrap">명 ~ 최대 </span>
                  <select
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                    className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                  <span className="font-suite text-lg text-cardContent ">명</span>
                </div>
              </div>
            </div>
            {/* 진행자 선택 */}
            <div className="flex gap-5 items-center">
              <span className="font-suite text-cardTitle text-xl font-bold">진행자</span>
              <div className="font-suite text-cardTitle text-lg flex gap-4">
                {["유", "무", "관계 없음"].map((option) => (
                  <RadioButton
                    key={option}
                    name="host"
                    value={option}
                    checked={selectedHost === option}
                    onChange={() => setSelectedHost(option)}
                  >
                    {option}
                  </RadioButton>
                ))}
              </div>
            </div>

            {/* 공개 여부 선택 */}
            <div className="flex gap-5 items-center">
              <span className="font-suite text-cardTitle text-xl font-bold">공개 여부</span>
              <div className="font-suite text-cardTitle text-lg flex gap-4">
                {["유", "무", "관계 없음"].map((option) => (
                  <RadioButton
                    key={option}
                    name="privacy"
                    value={option}
                    checked={selectedPrivacy === option}
                    onChange={() => setSelectedPrivacy(option)}
                  >
                    {option}
                  </RadioButton>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-5 mt-6">
              <Button text="취소하기" type="WHITE" className="text-cardContent border-2" onClick={() => nav(-1)} />
              <Button text="생성하기" type="GREEN" onClick={() => nav(-1)} />
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default CreateGroup;
