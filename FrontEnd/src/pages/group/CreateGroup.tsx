// import Header from "@components/Layout/Header";
// // import Footer from "@/components/Layout/Footer";
// import DiseaseDrop from "@components/common/DiseaseDrop";
// import Button from "@components/common/Button";
// import IconExit from "@assets/icons/IconExit";
// import InputForm from "@components/common/InputForm";
// import RadioButton from "@components/common/RadioButton";
// import DatePicker from "react-datepicker";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createGroupApi } from "@apis/group/groupCreateApi";
// import { CreateRoomReqestType } from "@utils/groups"; // ✅✔ 수정됨 - 타입 임포트 추가
// import React from "react";

// // ✅ 카테고리 변환
// // 필터 표시용 질병
// const diseases = [
//   "유전 및 희귀 질환",
//   "치매",
//   "정신건강",
//   "대사 및 내분비",
//   "심혈관",
//   "근골격계",
//   "암",
//   "피부 및 자가면역",
//   "소아청소년",
//   "기타",
// ];

// // 질병 이름을 ID로 변환
// const diseaseMap = {
//   "유전 및 희귀 질환": 1,
//   치매: 2,
//   정신건강: 3,
//   "대사 및 내분비": 4,
//   심혈관: 5,
//   근골격계: 6,
//   암: 7,
//   "피부 및 자가면역": 8,
//   소아청소년: 9,
//   기타: 10,
// } as Record<string, number>;

// // 숫자 요일로 변환
// const dayMap: Record<string, number> = {
//   월: 1,
//   화: 2,
//   수: 3,
//   목: 4,
//   금: 5,
//   토: 6,
//   일: 7,
// };

// function CreateGroup() {
//   const today = new Date();
//   const nav = useNavigate();

//   const [title, settitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   // const [diseaseId, setDiseaseId] = useState<string>("");
//   const [selectedDiseases, setSelectedDisease] = useState<string>("");

//   const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
//   const [selectedStartDate, setSelectedStartDate] = useState<Date>(today); // ✅ DatePicker에서 사용할 상태값
//   const [selectedDay, setSelectedDay] = useState<string>(""); // 요일 단일 선택으로 변경경
//   const [selectedStartTime, setSelectedStartTime] = useState<number>(18);

//   const [minMembers, setMinMembers] = useState<number>(2);
//   const [maxMembers, setMaxMembers] = useState<number>(8);

//   const [isPrivate, setisPrivate] = useState<boolean>(false);
//   const [privatePassword, setPrivatePassword] = useState<string>("");

//   const [isHost, setisHost] = useState<boolean>(true);
//   // const [startDate, setStartDate] = useState<number>(formattedToday);

//   // const [selectedEndTime, setSelectedEndTime] = useState<string>("20:00");

//   // ✅ DatePicker 날짜 선택 핸들러
//   const handleDateChange = (date: Date | null) => {
//     setSelectedStartDate(date || today);
//   };

//   // ✅ 요일 선택을 하나만 가능하도록 수정
//   const handleDaySelection = (day: string) => {
//     setSelectedDay(day);
//   };

//   function handleCloseModal() {
//     nav(-1);
//   }

//   // 모임생성 핸들러러
//   async function handleCreate() {
//     if (
//       !title ||
//       !description ||
//       !selectedStartDate ||
//       !selectedPeriod ||
//       selectedDay === null ||
//       diseaseId === null ||
//       !selectedStartTime ||
//       !minMembers ||
//       !maxMembers
//     ) {
//       alert("모든 필드를 입력하세요.");
//       return;
//     }

//     // ✅ 비밀번호 입력 값 제한
//     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;

//       // 숫자만 입력받고 4자리까지만 허용
//       if (/^\d{0,4}$/.test(value)) {
//         setPrivatePassword(value);
//       } else {
//         alert("비밀번호는 숫자 4자리로 입력해주세요.");
//       }
//     };

//     // 질병 아이디 변환, 기본값 기타
//     const diseaseId = diseaseMap[selectedDiseases] || 10;

//     const dayOfWeek = dayMap[selectedDay];

//     const requestData: CreateRoomReqestType = {
//       title,
//       diseaseId,
//       description,
//       isPrivate,
//       privatePassword: isPrivate ? privatePassword : "",
//       isHost,
//       // api명세서에서 date 형식인데, 뒤에 틀을 맞추는건 iso포멧 toISOString()
//       startDate: selectedStartDate,
//       period: selectedPeriod,
//       meetingTime: selectedStartTime,
//       dayOfWeek,
//       minMembers,
//       maxMembers,
//     };

//     try {
//       await createGroupApi(requestData);
//     } catch (error) {
//       console.error("모임생성 오류:", error);
//     }
//   }

//   return (
//     <div>
//       <Header title="모임 만들기" isicon={true} />
//       <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//         <div className="w-[85%] bg-offWhite rounded-[12px] p-5">
//           {/* 닫기 버튼 */}
//           <div onClick={handleCloseModal} className="flex justify-end mb-2">
//             <IconExit width={20} height={20} fillColor="" />
//           </div>
//           {/* 모임 관련련 */}
//           {/* 입력 폼 */}
//           <div className="flex flex-col gap-4">
//             <InputForm
//               title="모임명"
//               titleClassName="text-xl"
//               holder="모임명을 입력해주세요."
//               value={title}
//               onChange={(e) => settitle(e.target.value)}
//               caption="10자 이하"
//             />
//             <div>
//               <textarea
//                 className="resize-none font-suite rounded-[12px] py-3 px-4 text-cardLongContent
//               disabled:text-cardContent disabled:bg-cardSubcontent disabled:cursor-not-allowed bg-White text-18px w-full outline-none border-2 focus:border-yellow100 focus:ring-0.5 focus:ring-yellow100 min-h-[3rem] max-h-[15rem] overflow-hidden"
//                 placeholder="모임에 대해 간단히 소개해주세요."
//                 rows={2}
//                 value={description}
//                 onChange={(e) => {
//                   setDescription(e.target.value);
//                   e.target.style.height = "auto";
//                   e.target.style.height = `${e.target.scrollHeight}px`;
//                 }}
//               />
//             </div>

//             {/* 질병 선택 */}
//             <DiseaseDrop title="질병" value={selectedDiseases} onSelect={selectedDiseases} />

//             {/* 기간 및 시작 날짜 */}
//             <div className="flex justify-between">
//               <span className="flex items-center font-suite whitespace-nowrap text-xl font-bold text-cardTitle">
//                 기간
//               </span>
//               <select
//                 className="text-center border border-cardSubcontent rounded-xl text-lg font-suite text-cardTitle"
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(Number(e.target.value))}
//               >
//                 <option value="1~8주">{"1~8주"}</option>
//                 {[...Array(8)].map((_, i) => (
//                   <option className="text-lg font-suite" key={i + 1} value={i + 1}>
//                     {i + 1}주
//                   </option>
//                 ))}
//               </select>

//               {/* ✅ 시작날짜 캘린더 입력 수정 */}
//               <div className="flex items-center gap-2">
//                 <span className="font-suite whitespace-nowrap text-xl font-[600] text-cardTitle">시작날짜</span>
//                 <DatePicker
//                   selected={selectedStartDate}
//                   onChange={handleDateChange}
//                   className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle text-lg w-28"
//                   dateFormat="yy-MM-dd"
//                   minDate={today} // ✅ 오늘 이후 날짜만 선택 가능하도록 설정
//                 />
//               </div>
//             </div>

//             {/* 요일 선택 */}
//             <div className="">
//               <span className="font-suite text-cardTitle text-xl font-bold">요일</span>
//               <div className="font-suite text-cardTitle text-xl font-bold flex gap-2 mt-2">
//                 {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
//                   <button
//                     key={day}
//                     className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
//                       selectedDay === day ? "bg-green100 text-white" : "bg-cardSubcontent text-cardLongContent"
//                     }`}
//                     onClick={() => handleDaySelection(day)}
//                   >
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* 시간 선택 */}
//             <div className="flex items-center gap-2">
//               <span className="font-suite text-cardTitle text-xl font-bold">시간</span>
//               <select
//                 value={selectedStartTime}
//                 onChange={(e) => setSelectedStartTime(Number(e.target.value))}
//                 className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
//               >
//                 {[...Array(24)].map((_, i) => (
//                   <option key={i} value={i}>{`${i}:00`}</option>
//                 ))}
//               </select>
//             </div>

//             {/* ✅ 인원 선택 */}
//             <div className="">
//               <div className="flex items-center gap-2">
//                 <span className="font-suite text-cardTitle text-xl font-bold whitespace-nowrap">인원</span>
//                 <div className="flex items-center gap-2">
//                   <span className="font-suite text-lg whitespace-nowrap text-cardContent ">최소</span>
//                   <select
//                     value={minMembers}
//                     onChange={(e) => setMinMembers(Number(e.target.value))}
//                     className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
//                   >
//                     {[...Array(7)].map((_, i) => (
//                       <option key={i} value={i + 2}>
//                         {i + 2}
//                       </option>
//                     ))}
//                   </select>
//                   <span className=" text-cardContent  font-suite text-lg whitespace-nowrap">명 ~ 최대 </span>
//                   <select
//                     value={maxMembers}
//                     onChange={(e) => setMaxMembers(Number(e.target.value))}
//                     className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle font-normal"
//                   >
//                     {[...Array(7)].map((_, i) => (
//                       <option key={i} value={i + 2}>
//                         {i + 2}
//                       </option>
//                     ))}
//                   </select>
//                   <span className="font-suite text-lg text-cardContent ">명</span>
//                 </div>
//               </div>
//             </div>
//             {/* 진행자 선택 */}
//             <div className="flex gap-5 items-center">
//               <span className="font-suite text-cardTitle text-xl font-bold">진행자</span>
//               <div className="font-suite text-cardTitle text-lg flex gap-4">
//                 {["유", "무"].map((option) => (
//                   <RadioButton
//                     key={option}
//                     name="host"
//                     value={option}
//                     checked={isHost === (option === "유")}
//                     onChange={() => setisHost(option === "유")}
//                   >
//                     {option}
//                   </RadioButton>
//                 ))}
//               </div>
//             </div>

//             {/* 공개 여부 선택 */}
//             <div className="flex gap-5 items-center">
//               <span className="font-suite text-cardTitle text-xl font-bold">공개 여부</span>
//               <div className="font-suite text-cardTitle text-lg flex gap-4">
//                 {["유", "무"].map((option) => (
//                   <RadioButton
//                     key={option}
//                     name="Private"
//                     value={option}
//                     checked={isPrivate === (option === "유")}
//                     onChange={() => setisPrivate(option === "유")}
//                   >
//                     {option}
//                   </RadioButton>
//                 ))}
//               </div>
//             </div>
//             {/* 비밀번호 입력 (비공개 선택 시) */}
//             {isPrivate && (
//               <InputForm
//                 title="비밀번호"
//                 holder="비밀번호를 입력하세요."
//                 value={privatePassword}
//                 onChange={handlePasswordChange}
//                 maxLength={4} // 4자리 숫자만 입력 가능
//               />
//             )}

//             {/* 버튼 */}
//             <div className="flex justify-center gap-5 mt-6">
//               <Button text="취소하기" type="WHITE" className="text-cardContent border-2" onClick={() => nav(-1)} />
//               <Button text="생성하기" type="GREEN" onClick={() => handleCreate()} />
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default CreateGroup;

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

// Remove the duplicate disease definitions since they're defined in DiseaseDrop
const dayMap: Record<string, number> = {
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
  일: 7,
};

function CreateGroup() {
  const today = new Date();
  const nav = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<string>("월");
  const [selectedStartTime, setSelectedStartTime] = useState<number>(18);
  const [minMembers, setMinMembers] = useState<number>(2);
  const [maxMembers, setMaxMembers] = useState<number>(8);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [privatePassword, setPrivatePassword] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(true);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedStartDate(date);
    }
  };

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
  };

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

      if (!selectedDay) {
        alert("요일을 선택해주세요.");
        return;
      }

      if (minMembers > maxMembers) {
        alert("최소 인원이 최대 인원보다 클 수 없습니다.");
        return;
      }

      if (isPrivate && (!privatePassword || privatePassword.length !== 4)) {
        alert("비공개 모임의 경우 4자리 비밀번호를 입력해주세요.");
        return;
      }

      const dayOfWeek = dayMap[selectedDay];
      const startDateTime = new Date(selectedStartDate);
      startDateTime.setHours(selectedStartTime, 0, 0, 0);

      const requestData: CreateRoomReqestType = {
        title: title.trim(),
        diseaseId: selectedDiseaseId,
        description: description.trim(),
        isPrivate,
        privatePassword: isPrivate ? privatePassword : "",
        isHost,
        startDate: startDateTime, // Using properly formatted datetime
        period: selectedPeriod,
        meetingTime: selectedStartTime,
        dayOfWeek,
        minMembers,
        maxMembers,
      };

      console.log("Request data:", requestData);

      await createGroupApi(requestData);
      alert("모임이 성공적으로 생성되었습니다.");
      nav(-1);
    } catch (error: any) {
      if (error.response?.data?.message === "fail") {
        alert("해당 시간에 이미 예정된 모임이 있습니다.");
      } else {
        alert("모임 생성에 실패했습니다. 다시 시도해 주세요.");
      }
      console.error("모임생성 오류:", error);
    }
  };

  return (
    <div>
      <Header title="모임 만들기" isicon={true} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="w-[85%] bg-offWhite rounded-[12px] p-5">
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
                className="text-center border border-cardSubcontent rounded-xl text-lg font-suite text-cardTitle"
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
                  className="px-3 py-2 border border-cardSubcontent rounded-xl font-suite text-cardTitle text-lg w-28"
                  dateFormat="yy-MM-dd"
                  minDate={today}
                />
              </div>
            </div>

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

            <div className="flex items-center gap-2">
              <span className="font-suite text-cardTitle text-xl font-bold">매주 모임시간</span>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(Number(e.target.value))}
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
                    value={minMembers}
                    onChange={(e) => setMinMembers(Number(e.target.value))}
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
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
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
  );
}

export default CreateGroup;
