import Header from "@components/Layout/Header";
import DiseaseDrop from "@components/common/DiseaseDrop";
import Button from "@components/common/Button";
import IconExit from "@assets/icons/IconExit";
import InputForm from "@components/common/InputForm";
import RadioButton from "@components/common/RadioButton";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroupApi } from "@apis/group/groupCreateApi";
import { CreateRoomReqestType } from "@utils/groups";
import React from "react";
import IconCircle from "@/assets/icons/IconInfo";

// Remove the duplicate disease definitions since they're defined in DiseaseDrop
const dayMap: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

const korDayMap: Record<number, string> = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

function CreateGroup() {
  const today = new Date();
  const nav = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedStartTime, setSelectedStartTime] = useState<number>(18);
  const [minMember, setminMember] = useState<number>(2);
  const [maxMember, setmaxMember] = useState<number>(8);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [privatePassword, setPrivatePassword] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(true);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedStartDate(date);
      const selectedDay = date.getDay(); // 숫자로 변환
      setSelectedDay(korDayMap[selectedDay]);
      console.log("selectedday", selectedDay);
    }
  };

  // const handleDaySelection = (day: string) => {
  //   setSelectedDay(day);
  // };

  const handleCloseModal = () => {
    nav(-1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setPrivatePassword(value);
    }
  };

  // const formatDateTime = (date: Date, hour: number): string => {
  // Create a new date object with the selected date and time
  // const dateTime = new Date(date);
  // dateTime.setHours(hour, 0, 0, 0);

  // Format to ISO string and ensure it ends with 'Z'
  //   return dateTime.toISOString();
  // };

  const handleCreate = async () => {
    try {
      // Basic validations
      if (!title.trim()) {
        alert("모임명을 입력해주세요.");
        return;
      }

      if (!description.trim()) {
        alert("모임 소개를 입력해주세요.");
        return;
      }

      if (selectedDiseaseId === null) {
        alert("질병을 선택해주세요.");
        return;
      }

      // if (!selectedDay) {
      //   alert("요일을 선택해주세요.");
      //   return;
      // }

      if (minMember > maxMember) {
        alert("최소 인원이 최대 인원보다 클 수 없습니다.");
        return;
      }

      if (isPrivate && (!privatePassword || privatePassword.length !== 4)) {
        alert("비공개 모임의 경우 4자리 비밀번호를 입력해주세요.");
        return;
      }

      const dayOfWeek = dayMap[selectedDay];
      // const startDateTime = new Date(selectedStartDate);
      // startDateTime.setHours(selectedStartTime, 0, 0, 0);

      const formatStartDate = (date: Date): string => {
        const startDateObj = date ? new Date(date) : new Date();
        startDateObj.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정 (로컬 시간 유지)

        // YYYY-MM-DD 형식으로 변환 (UTC 변환 없이 로컬 시간 유지)
        const year = startDateObj.getFullYear();
        const month = String(startDateObj.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1
        const day = String(startDateObj.getDate()).padStart(2, "0");
        const time = selectedStartTime < 10 ? `0${selectedStartTime}` : selectedStartTime.toString();

        return `${year}-${month}-${day}T${time}:00:00Z`;
      };

      const requestData: CreateRoomReqestType = {
        title: title.trim(),
        diseaseId: selectedDiseaseId,
        description: description.trim(),
        isPrivate,
        privatePassword: isPrivate ? privatePassword : "",
        isHost,
        startDate: formatStartDate(selectedStartDate), // Using properly formatted datetime
        period: selectedPeriod,
        meetingTime: selectedStartTime,
        dayOfWeek,
        minMember,
        maxMember,
      };

      console.log("Request data:", requestData);

      const result = await createGroupApi(requestData);

      if (result === "success") {
        alert("모임이 생성되었습니다.");
        nav(-1); // 페이지 이동
      } else {
        alert("해당 시간에 이미 예정된 모임이 존재합니다."); // 실패 시 알림
      }
    } catch (error: any) {
      // if (error.response?.data?.message === "fail") {
      //   alert("해당 시간에 이미 예정된 모임이 있습니다.");
      // } else {
      alert("모임 생성에 실패했습니다. 다시 시도해 주세요.");
      console.error("모임생성 오류:", error);
    }
  };

  return (
    <div>
      <div className="h-screen flex justify-center bg-black/50">
        <div className="mx-1 overflow-y-auto">
          <Header title="모임 만들기" isicon={false} />
          <div className="max-w-3xl bg-offWhite rounded-[12px] p-4 mt-[-10px] mb-5">
            <div onClick={handleCloseModal} className="flex justify-end mb-2">
              <IconExit width={20} height={20} fillColor="" />
            </div>

            <div className="flex flex-col gap-4">
              <InputForm
                title="모임명"
                titleClassName="text-xl"
                holder="모임명을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                caption="10자 이하"
              />

              <div>
                <textarea
                  className="resize-none font-suite rounded-[12px] py-3 px-4 text-cardLongContent
                disabled:text-cardContent disabled:bg-cardSubcontent disabled:cursor-not-allowed 
                bg-White text-18px w-full outline-none border-2 focus:border-yellow100 
                focus:ring-0.5 focus:ring-yellow100 min-h-[3rem] max-h-[15rem] overflow-hidden"
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

              <DiseaseDrop
                title="질병"
                value={selectedDiseaseId}
                onSelect={(diseaseId: number) => setSelectedDiseaseId(diseaseId)}
              />

              <div className="flex justify-between">
                <span className="flex items-center font-suite whitespace-nowrap text-xl font-bold text-cardTitle">
                  기간
                </span>
                <select
                  className="text-center border border-cardSubcontent rounded-xl font-suite text-cardTitle"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                >
                  {[...Array(8)].map((_, i) => (
                    <option className="text-lg font-suite" key={i + 1} value={i + 1}>
                      {i + 1}주
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <span className="font-suite whitespace-nowrap text-xl font-[600] text-cardTitle">시작날짜</span>
                  <DatePicker
                    selected={selectedStartDate}
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle w-28"
                    dateFormat="yy-MM-dd"
                    minDate={today}
                  />
                </div>
              </div>

              <div className="">
                <div className="flex items-center gap-3">
                  <span className="font-suite text-cardTitle text-xl font-bold">요일</span>
                  <div className="flex items-center gap-1">
                    <IconCircle fillColor="#9D9D9D" />
                    <span className="font-suite text-cardContent2 text-sm font-bold">
                      날짜 지정시 자동으로 선택됩니다.
                    </span>
                  </div>
                </div>
                <div className="font-suite text-cardTitle text-xl font-bold flex gap-2 mt-2">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <div
                      key={day}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        selectedDay === day ? "bg-green100 text-white" : "bg-cardSubcontent text-cardLongContent"
                      }`}
                      // onClick={() => handleDaySelection(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-suite text-cardTitle text-xl font-bold">매주 모임시간</span>
                <select
                  value={selectedStartTime}
                  onChange={(e) => {
                    setSelectedStartTime(Number(e.target.value));
                  }}
                  className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>{`${i}:00`}</option>
                  ))}
                </select>
              </div>

              <div className="">
                <div className="flex items-center gap-2">
                  <span className="font-suite text-cardTitle text-xl font-bold whitespace-nowrap">인원</span>
                  <div className="flex items-center gap-2">
                    <span className="font-suite text-lg whitespace-nowrap text-cardContent">최소</span>
                    <select
                      value={minMember}
                      onChange={(e) => setminMember(Number(e.target.value))}
                      className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
                    >
                      {[...Array(7)].map((_, i) => (
                        <option key={i} value={i + 2}>
                          {i + 2}
                        </option>
                      ))}
                    </select>
                    <span className="text-cardContent font-suite text-lg whitespace-nowrap">명 ~ 최대</span>
                    <select
                      value={maxMember}
                      onChange={(e) => setmaxMember(Number(e.target.value))}
                      className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
                    >
                      {[...Array(7)].map((_, i) => (
                        <option key={i} value={i + 2}>
                          {i + 2}
                        </option>
                      ))}
                    </select>
                    <span className="font-suite text-lg text-cardContent">명</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <span className="font-suite text-cardTitle text-xl font-bold">진행자</span>
                <div className="font-suite text-cardTitle text-lg flex gap-4">
                  {["유", "무"].map((option) => (
                    <RadioButton
                      key={option}
                      name="host"
                      value={option}
                      checked={isHost === (option === "유")}
                      onChange={() => setIsHost(option === "유")}
                    >
                      {option}
                    </RadioButton>
                  ))}
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <span className="font-suite text-cardTitle text-xl font-bold">공개 여부</span>
                <div className="font-suite text-cardTitle text-lg flex gap-4">
                  {["공개", "비공개"].map((option) => (
                    <RadioButton
                      key={option}
                      name="Private"
                      value={option}
                      checked={isPrivate === (option === "비공개")}
                      onChange={() => setIsPrivate(option === "비공개")}
                    >
                      {option}
                    </RadioButton>
                  ))}
                </div>
              </div>

              {isPrivate && (
                <InputForm
                  title="비밀번호"
                  holder="비밀번호를 입력하세요."
                  value={privatePassword}
                  onChange={handlePasswordChange}
                  maxLength={4}
                />
              )}

              <div className="flex justify-center gap-5 mt-6">
                <Button text="취소하기" type="WHITE" className="text-cardContent border-2" onClick={handleCloseModal} />
                <Button text="생성하기" type="GREEN" onClick={handleCreate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
