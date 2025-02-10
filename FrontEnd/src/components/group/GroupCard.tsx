import { Group } from "@/utils/groups";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  // console.log("📌 GroupCard Props:", group);

  const router = useNavigate();

  // 12시간제로 변경해주는 함수
  const correctionHour = () => {
    if (group.meetingTime > 12 && 24 > group.meetingTime) {
      return `오후 ${group.meetingTime - 12}시`;
    } else if (group.meetingTime == 12) {
      return "낮 12시";
    } else if (group.meetingTime == 24) {
      return "밤 12시";
    } else {
      return `오전 ${group.meetingTime}시`;
    }
  };

  // 숫자 요일로 변환해주는 함수
  function dayOfWeekStr() {
    if (!group?.dayOfWeek) return "요일 미정"; // group이 없거나 dayOfWeek가 undefined일 경우 기본값 설정

    const weekDays: { [key: number]: string } = {
      1: "월요일",
      2: "화요일",
      3: "수요일",
      4: "목요일",
      5: "금요일",
      6: "토요일",
      7: "일요일",
    };

    return weekDays[group.dayOfWeek] || "요일 미정"; // 유효하지 않은 값 예외 처리
  }

  const onClickDetail = () => {
    router(`/groups/${group.groupId}`);
  };
  return (
    <div className="flex justify-center items-center w-full px-4">
      <div className="font-suite h-auto p-5 bg-white rounded-xl shadow-md flex flex-col justify-center items-start gap-3 w-full max-w-[600px]">
        {/* 질병 버튼 */}
        <div className="relative w-fit px-2.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
          <div className="text-center text-cardContent text-sm font-bold">{group.diseaseName}</div>
        </div>

        {/* 그룹 정보 */}
        <div className="flex flex-col justify-start items-start w-full gap-2">
          <div className="text-cardTitle text-xl md:text-2xl font-bold truncate w-full">{group.title}</div>
          <div className="flex flex-wrap justify-start items-center gap-x-2 gap-y-1 w-full">
            <div className="text-cardContent2 text-sm md:text-base font-semibold">일정</div>
            <div className="text-cardTitle text-sm md:text-base font-semibold">
              {new Date(group.startDate).toISOString().split("T")[0]}
            </div>
            <div className="text-cardContent2 text-sm md:text-base font-semibold">시작 매주</div>
            <div className="text-[#d98600] text-sm md:text-base font-semibold">{dayOfWeekStr()}</div>
            <div className="text-cardTitle text-sm md:text-base font-semibold">{correctionHour()}</div>
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div className="text-cardContent2 text-sm md:text-base font-semibold">참여인원</div>
            <div>
              <span className="text-[#d98600] text-sm md:text-base font-semibold">{group.totalMembers}</span>
              <span className="text-cardTitle text-sm md:text-base font-semibold"> / {group.maxiMembers}</span>
            </div>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <div
          className="w-full h-[40px] bg-[#6bb07c] rounded-xl flex justify-center items-center"
          onClick={onClickDetail}
        >
          <div className="text-white text-sm md:text-base font-bold">상세보기</div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
