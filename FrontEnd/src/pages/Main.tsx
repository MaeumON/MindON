import { useEffect, useState } from "react"; // useState 추가
import { useNavigate } from "react-router-dom";
import IllCaption from "@components/common/IllCaption";
import Button from "@components/common/Button";
import HeartBear from "@assets/images/heartbear.png";
import OkBear from "@assets/images/okbear.png";
import IconSearch from "@assets/icons/IconSearch";
import ShadowCard from "@components/common/ShadowCard";
import FavGroupCard from "@components/Mainpage/FavGroupCard";
import { fetchGroups } from "@apis/groupApi";
import { groupType } from "@apis/types/groups";
import Footer from "@components/Layout/Footer";
import useAuthStore from "@stores/authStore";

function Main() {
  // store 유저데이터 불러오기
  const { data } = useAuthStore();
  console.log("data", data);
  const userName = data.userName || "사용자";

  const nav = useNavigate();
  function navToList() {
    nav("/groupslist");
  }

  interface EventDics {
    diseaseName?: string;
    date?: string;
    starttime?: string;
    endtime?: string;
    title?: string;
  }

  const UpCommingEvent: EventDics | null = {
    diseaseName: "소아암",
    date: "1월 27일 월",
    starttime: "20:00",
    endtime: "20:50",
    title: "소아암 부모 모임 입니다",
  };

  const [groups, setGroups] = useState<groupType[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        console.log("Fetched Groups: ", data);
        setGroups(data);
      } catch (error) {
        console.error("Error Fetching groups : ", error);
      }
    };

    loadGroups();
  }, []);

  return (
    <div className="relative w-full max-w-[412px] mx-auto whitespace-nowrap">
      {/* 노란박스 */}
      <section className="relative flex flex-col bg-yellow100 card-title h-[245px] px-[40px] py-[40px]">
        <section className="flex flex-col gap-[10px] items-stretch">
          <div className="font-jamsilMedium text-28px text-cardTitle">안녕하세요, {userName}님</div>
          <div className="font-jamsilRegular text-24px text-cardTitle">오늘도 온이와 함께</div>
          <div className="font-jamsilRegular text-24px">마음을 ON 해볼까요?</div>
        </section>
      </section>

      {/* 흰색 박스 */}
      <ShadowCard className="absolute top-[200px] left-1/2 transform -translate-x-1/2 sm:w-[330px] w-[300px] ">
        <IllCaption diseaseName={UpCommingEvent?.diseaseName ?? "미정"} />
        <div className="flex flex-col items-start gap-[5px]">
          {UpCommingEvent ? (
            <>
              <div className="font-suite font-bold text-18px text-cardLongContent">
                {UpCommingEvent["date"] ?? "날짜미정"}
              </div>
              <div className="font-suite font-bold text-18px text-orange100">{`${UpCommingEvent["starttime"] ?? "시간미정"}-${UpCommingEvent["endtime"] ?? "시간미정"}`}</div>
              <div className="font-suite font-extrabold text-24px text-cardLongContent">
                {UpCommingEvent["title"] ?? "제목없음"}
              </div>
              <Button text={"입장하기"} type={"GREEN"} />
            </>
          ) : (
            <>
              <div className="font-suite text-24px font-semibold text-cardLongContent">
                오늘은 예정된 모임이 없어요.
              </div>
              <div className="font-suite text-24px font-bold text-orange100">새로 마음을 나누러 가볼까요?</div>
            </>
          )}
        </div>
      </ShadowCard>

      {/* 이벤트 아래 메인 컨텐츠 */}
      <div className="maincontents mb-[100px]">
        <div className="mt-[220px]">
          <section>
            <section id="talkbutton" className="flex justify-around px-[20px] h-[250px] sm:h-[300px] gap-[10px]">
              {/* 온 Talk 버튼 & OkBear */}
              <div className="relative cursor-pointer">
                <img
                  src={OkBear}
                  alt="온 Talk"
                  className="sm:w-[145px] sm:h-[145px] w-[120px] h-[120px]"
                  onClick={navToList}
                />
                <section
                  onClick={navToList}
                  className="flex flex-col justify-between items-center absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white py-[15px] rounded-[12px] shadow-md"
                >
                  <div className="flex justify-center items-center gap-[5px]">
                    <p className="text-cardLongContent font-jamsilMedium sm:text-24px text-20px whitespace-nowrap">
                      온 Talk
                    </p>
                    <IconSearch />
                  </div>
                  <div className="text-cardContent font-suite font-[600] sm:text-18px text-16px text-center sm:min-w-[165px] min-w-[140px]">
                    진행자 온이가 <br />
                    <span className="whitespace-nowrap">모임을 이끌어줘요</span>
                  </div>
                </section>
              </div>

              {/* 자유 Talk 버튼 & HeartBear */}
              <div className="relative cursor-pointer">
                <img
                  src={HeartBear}
                  alt="자유 Talk"
                  className="sm:w-[145px] sm:h-[145px] w-[120px] h-[120px]"
                  onClick={navToList}
                />
                <section
                  onClick={navToList}
                  className="flex flex-col justify-between items-center absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white py-[15px] rounded-[12px] shadow-md"
                >
                  <div className="flex justify-center items-center gap-[5px]">
                    <p className="text-cardLongContent font-jamsilMedium sm:text-24px text-20px whitespace-nowrap">
                      자유 Talk
                    </p>
                    <IconSearch />
                  </div>
                  <div className="text-cardContent font-suite font-[600] sm:text-18px text-16px  text-center sm:min-w-[165px] min-w-[140px]">
                    진행자 온이 없이 <br />
                    <span className="whitespace-nowrap">자유롭게 대화해요</span>
                  </div>
                </section>
              </div>
            </section>

            {/* 맞춤 모임 */}
            <div className="ps-[40px]">
              <div className="flex justify-start text-24px text-cardLongContent font-jamsilRegular font-medium">
                {userName}님을 위한 맞춤 모임
              </div>
              <div className="flex gap-[20px] mt-[20px] whitespace-nowrap overflow-x-auto scrollbar-hide pb-[30px]">
                {groups.length > 0 ? (
                  groups.map((group) => <FavGroupCard key={group.groupId} group={group} />)
                ) : (
                  <p className="text-18px text-cardLongContent font-jamsilRegular font-medium">
                    관심 그룹이 없습니다. <br /> 새로운 모임을 만들어볼까요?
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="h-[50px]" />
      <Footer />
    </div>
  );
}

export default Main;
