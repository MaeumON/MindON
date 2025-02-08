import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";
import GroupsFilter from "@components/group/GroupsFilter";
import Footer from "@components/Layout/Footer";
import { Group, RequestData } from "@apis/group/groupListApi";

import IconSearch from "@assets/icons/IconSearch";
import SeachFilter from "@assets/images/SeachFilter.png";

import groupListApi from "@apis/group/groupListApi";

import { useState, useEffect, useRef } from "react";

function GroupsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  // 무한스크롤 상태관리
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const onIntersection = (entries: IntersectionObserverEntry[]) => {
    const firstEntry = entries[0];

    // 첫화면이 렌더링 된 후 더 많은 데이터를 불러올 수 있는 상태(hasMore)인 경우 api 함수 호출
    if (firstEntry.isIntersecting && hasMore) {
      fetchMoreItems();
    }
  };

  // 컴포넌트 렌더링 이후에 실행되며 Intersection Observer를 설정
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, { threshold: 1 });

    //elementRef가 현재 존재하면 observer로 해당 요소를 관찰.
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // 컴포넌트가 언마운트되거나 더 이상 관찰할 필요가 없을 때(observer를 해제할 때)반환.
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasMore]);

  const fetchMoreItems = async () => {
    try {
      // 새로운 데이터를 불러올 API 엔드포인트에 요청을 보냅니다.
      const result = await groupListApi({ page });

      // 만약 더 이상 불러올 상품이 없다면 hasMore 상태를 false로 설정합니다.
      if (result.length === 0) {
        setHasMore(false);
      } else {
        // 불러온 데이터를 현재 상품 목록에 추가합니다.
        // 이전 상품 목록(prevProducts)에 새로운 데이터(data.products)를 연결합니다.
        setGroups((prevGroups) => [...prevGroups, ...result]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("무한 스크롤 데이터 요청 실패:", error);
    }
  };
  //hyebeen2658.tistory.com/77 [HYEBEN's Dev:티스토리]

  // 첫 렌더링 시 accessToken만 보내서 그룹 목록 불러오기
  useEffect(() => {
    const fetchInitialGroups = async () => {
      try {
        const result = await groupListApi({ page: 1 });
        console.log("📌 API 응답 데이터:", result);
        setGroups(result);
      } catch (error) {
        console.error("초기 그룹 목록 요청 실패:", error);
        setGroups([]); // 에러 발생 시 빈 배열 설정
      }
    };

    fetchInitialGroups();
  }, []);

  useEffect(() => {
    console.log("📌 groups 상태 변경됨:", groups);
  }, [groups]);

  // ✅ 필터가 적용된 API 요청을 받으면 실행됨
  const handleApplyFilter = async (selectedFilters: Partial<RequestData>) => {
    try {
      const result = await groupListApi({ ...selectedFilters, page: 1 });
      console.log("📌 필터 적용 API 응답:", result);
      setGroups(result); // 기존 그룹 목록을 새로운 목록으로 갱신
      setPage(2);
      setHasMore(true);
    } catch (error) {
      console.error("필터 적용 후 그룹 목록 요청 실패:", error);
    }
  };

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
          <IconSearch />
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
        {groups && groups.length > 0 ? ( // groups undefined 여부 확인
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
      {hasMore && <div ref={elementRef} className="h-10"></div>}

      {/* 모달 */}
      {isFilterOpen && (
        <GroupsFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilter={handleApplyFilter} />
      )}

      <Footer />
    </div>
  );
}

export default GroupsList;
