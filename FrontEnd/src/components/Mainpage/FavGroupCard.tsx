import IllCaption from "@/components/common/IllCaption";
import Card from "@/components/common/ShadowCard";
import { groupType } from "@/apis/types/groups";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

const FavGroupCard = ({ group }: { group: groupType }) => {
  const nav = useNavigate();
  function handleClick() {
    nav(`/groups/${group.groupId}`);
  }
  if (!group) return null; // group이 없는 경우 렌더링 방지

  return (
    <Card onClick={handleClick}>
      <IllCaption diseaseName={group.diseaseName ?? "기본값"} />
      <div className="font-suite font-bold text-20px text-cardTitle">{group.title}</div>
      <div className="font-suite font-semibold text-18px">
        <span className="text-cardTitle"> 매주 </span>
        <span className="text-orange100">
          {typeof group.dayOfWeek === "number" && group.dayOfWeek >= 0 && group.dayOfWeek <= 6
            ? daysOfWeek[group.dayOfWeek]
            : "요일 미정"}
        </span>
        <span className="text-cardTitle"> {group.meetingTime ?? "시간 미정"}시</span>
      </div>
    </Card>
  );
};

export default FavGroupCard;
