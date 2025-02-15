import Pagination from "react-js-pagination";
import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";
import GroupsFilter from "@components/group/GroupsFilter";
import Footer from "@components/Layout/Footer";
import "@assets/styles/pagination.css";
import { Group, RequestData } from "@utils/groups";
import { ReactJsPaginationProps } from "react-js-pagination";

import IconSearch from "@assets/icons/IconSearch";
import SeachFilter from "@assets/images/SeachFilter.png";

import groupListApi from "@apis/group/groupListApi";

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordModal from "@/components/group/PasswordModal";

const PaginationComponent = Pagination as unknown as React.ComponentType<ReactJsPaginationProps>;

function GroupsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

  const location = useLocation();
  const nav = useNavigate();

  // 페이지네이션
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

    nav(`/groupslist?${searchParams.toString()}`);
  }
  useEffect(() => {
    fetchGroups();
  }, [page, size, sort]);

  function onClickDetail(groupId: number) {
    //isPrivate 확인
    const isPrivate = groups.find((group) => group.groupId === groupId)?.isPrivate;
    if (isPrivate) {
      setPasswordModal(true);
      setSelectedGroupId(groupId);
    } else {
      nav(`/groups/${groupId}`);
    }
  }

  // ✅ 그룹 목록을 가져오는 API 함수
  async function fetchGroups() {
    try {
      //  sessionStorage에서 필터 값 가져오기
      const storedFilters = sessionStorage.getItem("groupFilters");
      const savedFilters: Partial<RequestData> = storedFilters ? JSON.parse(storedFilters) : {};

      const filters: Partial<RequestData> = { ...savedFilters };

      // ✅ 메인페이지에서 그룹 연결
      //  `isHost` 파라미터 처리 (sessionStorage와 URL 중 URL을 우선 적용)
      const isHostParam = queryParams.get("isHost");
      if (isHostParam !== null) {
        filters.isHost = isHostParam === "1" ? true : isHostParam === "0" ? false : null;
      }

      // sessionStorage에 업데이트된 필터 값 저장
      sessionStorage.setItem("groupFilters", JSON.stringify(filters));

      // ✅ API 요청
      const result = await groupListApi(filters, page, size, sort);
      console.log("📌 그룹 목록 API 응답:", result);
      setGroups(result.content);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error("그룹 목록 요청 실패:", error);
      setGroups([]);
    }
  }

  // ✅ useEffect에서 fetchGroups() 호출 (sessionStorage 값 반영)
  useEffect(() => {
    fetchGroups();
  }, [page, size, sort]);

  // 적용하기 클릭 시 시행
  async function handleApplyFilter(filters: Partial<RequestData>) {
    try {
      const result = await groupListApi(filters);
      setGroups(result.content); // 기존 그룹 목록을 새로운 목록으로 갱신
      // console.log("📌 필터 적용 API 응답:", result);
    } catch (error) {
      console.error("필터 적용 후 그룹 목록 요청 실패:", error);
    }
  }

  // ✅검색창
  // 검색 기능 API 호출
  async function fetchSearchGroups() {
    if (!keyword.trim()) {
      // 빈 값으로 검색하면 전체 목록 조회
      fetchGroups();
      return;
    }

    try {
      const result = await groupListApi({ keyword });
      console.log("📌 검색 API 응답:", result);
      setGroups(result.content);
    } catch (error) {
      console.log("검색 요청 실패 : ", error);
    }
  }

  // 검색 입력값 업데이트
  function onChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  // 검색 실행(아이콘)
  function onClickSearchIcon() {
    fetchSearchGroups();
  }

  // 검색 실행(엔터키)
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      fetchSearchGroups();
    }
  }

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
      <button onClick={() => setIsFilterOpen(true)}>
        <div className="flex flex-1 left-[30px] my-5 ml-6">
          <img src={SeachFilter} className="w-[20px] h-[20px]" />
          <div className="ms-3 text-cardLongContent text-base font-bold font-suite">검색 필터</div>
        </div>
      </button>

      {/* 그룹 목록 */}
      <div className="flex flex-col gap-5 pb-20">
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              onClick={() => onClickDetail(group.groupId)} // onClick 전달
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

      {/* 필터 모달 */}
      {isFilterOpen && (
        <GroupsFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilter={handleApplyFilter} />
      )}

      {/* 비밀번호 모달 */}
      {passwordModal && <PasswordModal selectedGroupId={selectedGroupId} setPasswordModal={setPasswordModal} />}

      <Footer />
    </div>
  );
}

export default GroupsList;
