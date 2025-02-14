import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";

import Footer from "@components/Layout/Footer";
import { Group } from "@utils/groups";
import React from "react";

import IconSearch from "@assets/icons/IconSearch";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { groupStatusApi } from "@/apis/group/groupListApi";
import Pagination from "react-js-pagination";
import { ReactJsPaginationProps } from "react-js-pagination";

const PaginationComponent = Pagination as unknown as React.ComponentType<ReactJsPaginationProps>;

function MyPageGroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const { groupStatus } = useParams();

  console.log(groupStatus);
  const nav = useNavigate();

  // ✅ 마운트 API 요청
  const fetchInitialGroups = async (groupStatus: string | undefined, keyword: string) => {
    try {
      console.log("마운트 api 요청중");

      const result = await groupStatusApi({ groupStatus, keyword });
      console.log("group status : ", groupStatus);
      console.log("📌 API 응답 데이터:", result);
      setGroups(result.content);
      console.log("📌 setGroup 이후 :", groups);
    } catch (error) {
      console.error("초기 그룹 목록 요청 실패:", error);
      setGroups([]); // 에러 발생 시 빈 배열 설정
    }
  };
  // 첫 렌더링 시 accessToken만 보내서 그룹 목록 불러오기
  useEffect(() => {
    fetchInitialGroups(groupStatus, "");
  }, []);

  // ✅ 페이지네이션
  const [totalItems, setTotalItems] = useState(0);

  // 파라미터 추출

  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page")) || 1;
  const size = Number(queryParams.get("size")) || 10;
  const sort = queryParams.get("sort") || "startDate,asc";

  // 페이지 변경 핸들러
  function handlePageChange(newPage: number) {
    const searchParams = new URLSearchParams();
    searchParams.set("page", newPage.toString());
    searchParams.set("size", size.toString());
    searchParams.set("sort", sort);

    nav(`/mypage/groupslist?${groupStatus}${searchParams.toString()}`);
  }
  useEffect(() => {
    fetchGroups();
  }, [page, size, sort]);

  // ✅ 그룹 목록을 가져오는 API 함수
  async function fetchGroups() {
    try {
      const result = await groupStatusApi({ groupStatus, keyword }, page, size, sort);
      console.log("📌 그룹 목록 API 응답:", result);
      setGroups(result.content);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error("그룹 목록 요청 실패:", error);
      setGroups([]);
    }
  }

  // ✅검색창
  // 검색 기능 API 호출
  const fetchSearchGroups = async () => {
    if (!keyword.trim()) {
      // 빈 값으로 검색하면 전체 목록 조회
      fetchInitialGroups(groupStatus, "");
      return;
    }
    try {
      const result = await groupStatusApi({ groupStatus, keyword });
      console.log("📌 검색 API 응답:", result);
      setGroups(result.content);
    } catch (error) {
      console.log("검색 요청 실패 : ", error);
    }
  };
  // 검색 입력값 업데이트
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  // 검색 실행(아이콘)
  const onClickSearchIcon = () => {
    fetchSearchGroups();
  };
  // 검색 실행(엔터키)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSearchGroups();
    }
  };

  // 마이데이터 상세로 이동하는 함수
  const onClickMyPageDetail = (groupId: number) => {
    nav(`/mypage/${groupId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={"모임목록보기"} isicon={true} className="bg-yellow100" />
      {/* 검색창 */}
      <div className="h-[85px] px-5 py-3 flex-col justify-start items-start gap-2.5 flex bg-yellow100">
        <div className="self-stretch h-[46px] px-4 py-2 bg-offWhite rounded-lg justify-start items-center gap-5 inline-flex overflow-hidden">
          <div className="grow shrink basis-0 h-5 justify-start items-center gap-2.5 flex">
            <input
              value={keyword}
              onChange={onChangeSearch}
              onKeyDown={handleKeyDown}
              className="bg-offWhite grow shrink basis-0 text-cardLongContent text-base font-bold font-suite offWhite"
              placeholder="원하는 모임이나 초대코드를 검색해보세요"
            ></input>
          </div>
          <button onClick={onClickSearchIcon}>
            <IconSearch />
          </button>
        </div>
      </div>
      {/* 검색 필터 */}
      {/* <button onClick={() => setIsFilterOpen(true)}>
        <div className="flex flex-1 left-[30px] my-5 ml-6">
          <img src={SeachFilter} className="w-[20px] h-[20px]" />
          <div className="ms-3 text-cardLongContent text-base font-bold font-suite">검색 필터</div>
        </div>
      </button> */}
      <br />
      {/* 그룹 목록 */}
      <div className="flex flex-col gap-5 pb-20">
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              onClick={() => onClickMyPageDetail(group.groupId)} // onClick 전달
            />
          ))
        ) : (
          <div className="flex m-6 justify-center items-center h-80 font-suite text-18px font-[600] text-cardLongContent leading-8">
            아직 그룹이 없어요
            <br />
            아래 + 버튼을 눌러
            <br />
            그룹을 생성해보세요!
          </div>
        )}
      </div>
      {/* 페이지네이션 */}
      <div className="flex justify-center items-center mb-[100px]">
        {totalItems > 0 && (
          <PaginationComponent
            activePage={page}
            itemsCountPerPage={size}
            totalItemsCount={totalItems}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            prevPageText={"‹"}
            nextPageText={"›"}
            firstPageText={"«"}
            lastPageText={"»"}
          />
        )}
      </div>
      {/* 모달 */}
      {/* {isFilterOpen && (
        <GroupsFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilter={handleApplyFilter}
          selectedFilters={selectedFilters}
        />
      )} */}
      <Footer />
    </div>
  );
}

export default MyPageGroupList;
