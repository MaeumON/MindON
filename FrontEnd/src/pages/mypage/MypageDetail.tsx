import Introbear from "@assets/images/bear/introbear.png";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import Button from "@components/common/Button";
import groupDetailApi from "@apis/group/groupDetailApi";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import groupDetailJoinApi from "@/apis/group/groupDetailJoinApi";
import groupDetailLeaveApi from "@/apis/group/groupDetailLeaveApi";
import GroupJoinModal from "@components/group/GroupJoinModal";
import React from "react";
import { useNavigate } from "react-router-dom";

function MypageDetail() {
  const { groupId } = useParams();
  const [isRegi, setIsRegi] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const queryClient = useQueryClient();
  const router = useNavigate();

  // React 쿼리로 그룹 상세 정보 가져오기
  // undefined일 경우 API 요청 안함(타입 가드)
  const fetchGroupDetail = async () => {
    if (!groupId) {
      return Promise.reject(new Error("groupId가 없습니다.")); // ✅ 예외 처리
    }
    const response = await groupDetailApi(groupId);

    console.log("리액트쿼리", groupId);
    console.log("fetchGroupDetail API 응답:", response);
    return response;
  };

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groupDetail", groupId],
    queryFn: fetchGroupDetail,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱 유지(옵션)
    enabled: !!groupId, // groupId가 존재할 때만 API 요청
  });

  function enterVideoCall() {
    const groupId = group?.groupId;
    const groupName = group?.title;
    router(`/prejoin/${groupId}/${groupName}`);
  }

  // group 데이터가 변경될 때 isRegi 상태 업데이트
  useEffect(() => {
    if (group) setIsRegi(group.registered);
  }, [group]);

  // 참여/취소 버튼 클릭 시 API 요청
  const onClickJoin = async () => {
    if (!groupId) {
      return Promise.reject(new Error("groupId가 없습니다."));
    }
    try {
      if (!isRegi) {
        const result = await groupDetailJoinApi(groupId);
        if (result.message === "success") {
          setIsRegi(true);
          // 캐시 업데이트
          queryClient.setQueryData(["groupDetail", groupId], (oldData: any) => ({
            ...oldData,
            registered: true,
          }));
          setShowJoinModal(true);
          setTimeout(() => {
            setShowJoinModal(false);
          }, 2000);
        } else if (result.message === "GroupJoinSameTime") {
          alert("같은 시간대에 다른 모임이 있습니다");
        } else {
          alert("그룹 참여 인원이 가득찼습니다");
        }
      } else {
        await groupDetailLeaveApi(groupId);
        setIsRegi(false);
        // 캐시 업데이트
        queryClient.setQueryData(["groupDetail", groupId], (oldData: any) => ({
          ...oldData,
          registered: false,
        }));
        setShowJoinModal(true);
        setTimeout(() => {
          setShowJoinModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("요청을 처리하는 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
    }
  };
  // 12시간제로 변경해주는 함수
  function correctionHour() {
    if (!group || group.meetingTime === undefined) return ""; // group `undefined 방지
    if (group.meetingTime > 12 && 24 > group.meetingTime) {
      return `오후 ${group.meetingTime - 12}시`;
    } else if (group.meetingTime === 12) {
      return "낮 12시";
    } else if (group.meetingTime === 0) {
      return "밤 12시";
    } else {
      return `오전 ${group.meetingTime}시`;
    }
  }

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

  // 시작일 포맷팅 함수
  function getFormattedStartDate() {
    if (!group?.startDate || !group?.dayOfWeek) return "시작일 미정"; // group `undefined` 방지

    const dateObj = new Date(group.startDate);
    const month = dateObj.getMonth() + 1; // 0부터 시작하므로 +1
    const day = dateObj.getDate();

    return `${month}월 ${day}일 ${dayOfWeekStr()}부터 시작`;
  }

  // 진행자 여부 관련 함수
  function getHostMessage() {
    if (group?.isHost) {
      return (
        <div>
          <span className="text-cardLongContent text-lg font-medium leading-[35px]">모임의 </span>
          <span className="text-[#d98600] text-lg font-bold leading-[35px]">진행은 온이</span>
          <span className="text-cardLongContent text-lg font-medium leading-[35px]">가 해줄거에요</span>
        </div>
      );
    }
    return (
      <div>
        <span className="text-[#d98600] text-lg font-bold leading-[35px]">진행자 없이 </span>
        <span className="text-cardLongContent text-lg font-medium leading-[35px]">자유롭게 소통하는 모임이에요</span>
      </div>
    );
  }

  // 공개방 여부 관련 함수
  function getPrivateMessage() {
    if (group?.isPrivate) {
      return (
        <div>
          <span className="text-cardLongContent text-lg font-medium leading-[35px]">우리만의 </span>
          <span className="text-[#d98600] text-lg font-bold leading-[35px]">비밀방</span>
          <span className="text-cardLongContent text-lg font-medium leading-[35px]">에서 편하게 대화 나눠요</span>
        </div>
      );
    }
    return (
      <div>
        <span className="text-cardLongContent text-lg font-medium leading-[35px]">누구나 들어올 수 있는 </span>
        <span className="text-[#d98600] text-lg font-bold leading-[35px]">공개방</span>
        <span className="text-cardLongContent text-lg font-medium leading-[35px]">이에요</span>
      </div>
    );
  }

  // 로딩중이거나 에러 발생했을 때 처리
  if (isLoading) return <div className="flex flex-col text-center items-center justify-center mt-10">로딩 중...</div>;
  if (error)
    return (
      <div className="flex flex-col text-center items-center text-center mt-10 text-red-500">
        그룹 정보를 불러오는 데 실패했습니다.
      </div>
    );
  if (!group)
    return (
      <div className="flex flex-col text-center items-center text-center mt-10 text-gray-500">
        그룹 정보를 찾을 수 없습니다.
      </div>
    ); // 예외처리 추가

  // 플로팅 버튼

  interface GroupButtonProps {
    groupStatus: number;
    onClickJoin: () => void; // 클릭 핸들러 props 추가
  }

  const GroupButton: React.FC<GroupButtonProps> = ({ groupStatus, onClickJoin }) => {
    if (groupStatus === 0) {
      return (
        <Button
          text="취소하기"
          type="ORANGE"
          onClick={onClickJoin}
          className="mb-10 fixed bottom-[60px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[392px] w-auto shadow-lg"
        />
      );
    }
    if (groupStatus === 1) {
      return (
        <Button
          text="참여하기"
          type="GREEN"
          onClick={enterVideoCall}
          className="mb-10 fixed bottom-[60px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[392px] w-auto shadow-lg"
        />
      );
    }
    return null; // groupStatus === 2일 때 버튼 렌더링 안 함
  };

  return (
    <div className="pb-[74px]">
      {showJoinModal && <GroupJoinModal isRegi={isRegi} />}
      <div className="flex flex-col gap-5">
        <Header title={"모임 상세보기"} isicon={true} className="bg-offWhite" />

        {/* 모임 상세정보 박스 */}
        <div className="flex flex-col font-suite items-start justify-center mx-5  mb-[100px] pt-6 bg-white rounded-xl gap-5 inline-flex overflow-hidden">
          <div className="px-5 justify-start items-center gap-2.5 inline-flex">
            {/* 질병 버튼 */}
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">{group?.diseaseName}</div>
            </div>
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">{dayOfWeekStr()}</div>
            </div>
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">{correctionHour()}</div>
            </div>
          </div>
          {/* 모임 정보 */}
          <div className="flex-col justify-start items-start gap-10 flex">
            {/* 모임 타이틀 */}
            <div className="px-5 justify-start items-start gap-2.5 inline-flex">
              <div className="text-cardTitle text-[32px] font-jamsilMedium">{group?.title}</div>
            </div>
            {/* 모임 소개 */}
            <div className="flex-col justify-start items-start flex gap-10">
              <div className="flex-col justify-start items-start flex">
                <div className=" px-5 justify-start items-center gap-2.5 inline-flex">
                  <div className="text-cardTitle text-2xl font-jamsilMedium">모임 소개</div>
                </div>
                <div className=" px-8 py-2.5 rounded-2xl justify-start items-start gap-2.5 inline-flex">
                  <div className="text-cardLongContent text-lg font-medium leading-[35px]">{group?.description}</div>
                </div>
              </div>
              {/* 모임 정보 */}
              <div className="flex-col justify-start items-start flex">
                <div className=" px-5 justify-start items-center gap-2.5 inline-flex">
                  <div className="text-cardTitle text-2xl font-jamsilMedium">모임 현황</div>
                </div>
                <div className="px-5 py-2.5 justify-start items-start gap-2.5 inline-flex leading-[35px] text-lg">
                  <div className="grow shrink basis-0 px-3">
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">지금까지 </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">{group?.progressWeeks}회 </span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">동안 함께 했어요</span>
                    <br />
                    <span className="text-[#d98600] text-lg font-bold ">&quot;{group?.diseaseName}&quot;</span>
                    <span className="text-cardLongContent text-lg font-medium">
                      라는 주제로 이야기해요
                      <br />
                      매주{" "}
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">
                      {dayOfWeekStr()} {correctionHour()}
                    </span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      에 만나요
                      <br />
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">{getFormattedStartDate()}</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      해요
                      <br />
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">
                      최소 {group?.minMember}명 이상 최대 {group?.maxMember}명 이하
                    </span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">로 참여해요</span>
                    {getHostMessage()}
                    {getPrivateMessage()}
                  </div>
                </div>
              </div>
              <div className="flex inline-flex justify-center items-center mx-5 gap-3">
                <div className="flex text-cardLongContent text-base font-medium leading-tight px-10 py-3 bg-yellow100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl justify-center items-center gap-2.5 ">
                  함께 마음의 온기를
                  <br /> 나누러 가볼까요??
                </div>
                <div className="flex flex-col justify-center items-center inline-flex">
                  <img src={Introbear} alt="온이" className="sm:w-[113px] sm:h-[120px] w-[93px] h-[100px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {group?.groupStatus !== 2 && <GroupButton groupStatus={group?.groupStatus} onClickJoin={onClickJoin} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MypageDetail;
