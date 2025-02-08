import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";
import GroupsFilter from "@components/group/GroupsFilter";
import Footer from "@components/Layout/Footer";

import SearchReadingGlasses from "@assets/images/SearchReadingGlasses.png";
import SeachFilter from "@assets/images/SeachFilter.png";

import groupListApi from "@apis/group/groupListApi";
import useAuthStore from "@stores/authStore";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

function GroupsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const authStore = useAuthStore();

  const fetchGroups = useCallback(async () => {
    if (!hasMore) return;

    const requestData = {
      keyword,
      diseaseId,
      isHost,
      startDate,
      period,
      startTime,
      endTime,
      dayOfWeek,
    };

    try {
      const result = await groupListApi(requestData);

      if (result.data.data.length === 0) {
        setHasMore(false);
      } else {
        setGroups((prev) => [...prev, ...result.data.data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }, [hasMore]);

  useEffect(() => {
    if (inView) fetchGroups();
  }, [inView, fetchGroups]);

  return (
    <div>
      <Header title={"모임목록보기"} isicon={true} className="bg-yellow100" />

      {/* 검색창 */}
      <div className="h-[85px] px-5 py-3 flex-col justify-start items-start gap-2.5 flex bg-yellow100">
        <div className="self-stretch h-[46px] px-4 py-2 bg-offWhite rounded-lg justify-start items-center gap-5 inline-flex overflow-hidden">
          <div className="grow shrink basis-0 h-5 justify-start items-center gap-2.5 flex">
            <input
              className="bg-offWhite grow shrink basis-0 text-cardLongContent text-base font-bold font-suite offWhite"
              placeholder="원하는 모임이나 초대코드를 검색해보세요"
            ></input>
          </div>
          <img src={SearchReadingGlasses} className="w-[20px] h-[20px]" />
        </div>
      </div>

      {/* 검색 필터 */}
      <button onClick={() => setIsFilterOpen(true)}>
        <div className="flex flex-1 left-[30px] my-5 ml-6">
          <img src={SeachFilter} className="w-[20px] h-[20px]" />
          <div className="ms-3 text-cardLongContent text-base font-bold font-suite">검색 필터</div>
        </div>
      </button>

      {/* 그룹 목록 */}
      <div className="flex flex-col gap-5 pb-20">
        {groups.length > 0 ? (
          groups.map((group) => <GroupCard key={group.groupId} group={group} />)
        ) : (
          <div className="flex m-6 justify-center items-center h-80 text-lg font-bold text-gray-500 leading-8">
            아직 그룹이 없어요
            <br />
            아래 + 버튼을 눌러
            <br />
            그룹을 생성해보세요!
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 */}
      {hasMore && <div ref={ref} className="h-10"></div>}

      {/* 모달 */}
      {isFilterOpen && <GroupsFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />}

      <Footer />
    </div>
  );
}

export default GroupsList;
