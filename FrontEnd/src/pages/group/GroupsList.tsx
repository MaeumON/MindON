import "@assets/styles/pagination.css";

import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";
import GroupsFilter from "@components/group/GroupsFilter";
import Footer from "@components/Layout/Footer";
import { Group, RequestData } from "@utils/groups";

import IconSearch from "@assets/icons/IconSearch";
import SeachFilter from "@assets/images/SeachFilter.png";
import FilterReset from "@assets/images/FilterReset.png";
import groupListApi from "@apis/group/groupListApi";

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordModal from "@/components/group/PasswordModal";
import Pagination from "react-js-pagination";
import { ReactJsPaginationProps } from "react-js-pagination";

const PaginationComponent = Pagination as unknown as React.ComponentType<ReactJsPaginationProps>;

function GroupsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [reset, setReset] = useState(false); // 전체해제 클릭여부

  const location = useLocation();
  const nav = useNavigate();

  // 페이지네이션
  const [totalItems, setTotalItems] = useState(0);

  // page 상태 추가
  const [currentPage, setCurrentPage] = useState(1);

  // URL 파라미터 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newPage = Number(queryParams.get("page")) || 1;
    setCurrentPage(newPage);
  }, [location.search]);

  // 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
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

  // 필터 기본값
  const DEFAULT_FILTERS: RequestData = {
    diseaseId: [],
    isHost: null,
    startDate: null,
    period: 0,
    startTime: 0,
    endTime: 23,
    dayOfWeek: [],
  };

  // 숫자 요일로 변환
  const dayMap: Record<string, number> = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };

  // 숫자 → 요일 변환을 위한 매핑
  const reverseDayMap: Record<number, string> = Object.entries(dayMap).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<number, string>
  );

  // 질병 이름을 ID로 변환
  const diseaseMap = {
    "유전 및 희귀 질환": 1,
    치매: 2,
    정신건강: 3,
    "대사 및 내분비": 4,
    심혈관: 5,
    근골격계: 6,
    암: 7,
    "피부 및 자가면역": 8,
    소아청소년: 9,
    기타: 10,
  } as Record<string, number>;

  // 🔹 숫자 → 질병명 변환을 위한 매핑
  const reverseDiseaseMap: Record<number, string> = Object.entries(diseaseMap).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<number, string>
  );

  // ✅ 그룹 목록을 가져오는 API 함수
  async function fetchGroups() {
    try {
      const storedFilters = sessionStorage.getItem("groupFilters");
      const savedFilters: Partial<RequestData> = storedFilters ? JSON.parse(storedFilters) : {};

      // URL 파라미터에서 isHost 값 가져오기
      const isHostParam = queryParams.get("isHost");
      const newIsHostValue =
        isHostParam !== null ? (isHostParam === "1" ? true : isHostParam === "0" ? false : null) : null;

      // 현재 적용된 필터와 URL의 isHost 값 합치기
      let currentFilters = { ...savedFilters };
      if (newIsHostValue !== null && !reset) {
        currentFilters.isHost = newIsHostValue;
      }

      // 키워드 검색이 있는 경우
      if (keyword.trim()) {
        currentFilters = { keyword: keyword.trim() };
      }

      // 필터가 하나라도 있는 경우에만 sessionStorage 업데이트
      if (Object.keys(currentFilters).length > 0) {
        sessionStorage.setItem("groupFilters", JSON.stringify(currentFilters));
      }

      // API 호출
      const result = await groupListApi(currentFilters, currentPage, size, sort);
      setGroups(result.content);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error("그룹 목록 요청 실패:", error);
      setGroups([]);
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isHostParam = queryParams.get("isHost");

    console.log("🔹 isHostParam:", isHostParam);
    // isHost 값을 boolean 또는 null로 변환
    const newIsHostValue =
      isHostParam !== null ? (isHostParam === "1" ? true : isHostParam === "0" ? false : null) : null;

    setAppliedFilters((prevFilters) => {
      // 기존 값과 다를 때만 업데이트
      if (prevFilters.isHost !== newIsHostValue) {
        const updatedFilters = { ...prevFilters, isHost: newIsHostValue };
        console.log("🔹 appliedFilters 업데이트:", updatedFilters);
        return updatedFilters;
      }
      return prevFilters; // 기존 값 유지
    });
  }, [location.search]); // URL이 변경될 때마다 실행

  // ✅ 적용하기 클릭 시 시행
  async function handleApplyFilter(filters: Partial<RequestData>) {
    try {
      const result = await groupListApi(filters);
      setGroups(result.content); // 기존 그룹 목록을 새로운 목록으로 갱신
      setAppliedFilters(filters); // 적용된 필터 상태 갱신
      sessionStorage.setItem("groupFilters", JSON.stringify(filters)); // sessionStorage에 적용된 필터 저장
      // console.log("📌 필터 적용 API 응답:", result);
    } catch (error) {
      console.error("필터 적용 후 그룹 목록 요청 실패:", error);
    }
  }

  // ✅ 적용된 필터 렌더링 기능
  // 기본값이 아닌 필터만 저장하는 함수
  const getNonDefaultFilters = (filters: Partial<RequestData>) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        // 빈 배열이거나 null, undefined, 0인 경우 제외
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return false;
        }

        // startDate가 null이거나 기본값인 경우 제외
        if (key === "startDate" && (value === null || value === DEFAULT_FILTERS.startDate)) {
          return false;
        }

        // period가 0인 경우 제외
        if (key === "period" && value === 0) {
          return false;
        }

        // startTime이 0이고 endTime이 23인 경우 제외
        if (key === "startTime" && value === 0) {
          return false;
        }
        if (key === "endTime" && value === 23) {
          return false;
        }

        // 기본값과 다른 경우만 포함
        return JSON.stringify(value) !== JSON.stringify(DEFAULT_FILTERS[key as keyof RequestData]);
      })
    );
  };

  const [appliedFilters, setAppliedFilters] = useState<Partial<RequestData>>(() => {
    const storedFilters = sessionStorage.getItem("groupFilters");
    const parsedFilters = storedFilters ? JSON.parse(storedFilters) : {};

    // 기존 저장된 필터 값에서 기본값과 다른 필터만 유지
    const nonDefaultFilters = getNonDefaultFilters(parsedFilters);

    // URL에서 가져온 isHostParam 적용
    const isHostParam = queryParams.get("isHost");
    const newIsHostValue =
      isHostParam !== null ? (isHostParam === "1" ? true : isHostParam === "0" ? false : null) : null;

    // isHost 값이 있는 경우에만 포함
    const filters = getNonDefaultFilters({ ...nonDefaultFilters });
    if (newIsHostValue !== null) {
      filters.isHost = newIsHostValue;
    }

    return filters;
  });

  // 개별 필터 제거
  const removeFilter = (filterKey: keyof RequestData) => {
    setAppliedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[filterKey]; // 해당 필터 제거
      sessionStorage.setItem("groupFilters", JSON.stringify(updatedFilters)); // sessionStorage 업데이트
      fetchGroups(); // 필터가 변경되면 그룹 목록 다시 불러오기
      return updatedFilters;
    });
  };

  // 전체 필터 해제
  const clearAllFilters = () => {
    setReset(true); // 전체해제 클릭여부 변경
    sessionStorage.removeItem("groupFilters"); // sessionStorage에서 필터 삭제
    setAppliedFilters({}); // 상태 초기화

    // url 속 isHost 제거
    const searchParams = new URLSearchParams(location.search);
    searchParams?.delete("isHost");

    // 필터 초기화 후 그룹 목록 다시 불러오기
    setAppliedFilters({});

    // URL 업데이트 (페이지 새로고침 없이 반영)
    nav(`/groupslist?${searchParams.toString()}`, { replace: true });
  };

  // 값 변경시 fetchGroups 재렌더링
  useEffect(() => {
    fetchGroups();
    console.log("UI 필터값", appliedFilters);
  }, [currentPage, size, sort, appliedFilters]);

  // ✅검색창
  // 검색 기능 처리
  function onChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function onClickSearchIcon() {
    fetchGroups(); // 기존 fetchSearchGroups() 대신 fetchGroups() 사용
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      fetchGroups(); // 기존 fetchSearchGroups() 대신 fetchGroups() 사용
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
      <div className="flex w-full item-center justify-between px-5 font-suite">
        <button onClick={() => setIsFilterOpen(true)}>
          <div className="flex flex-1 left-[30px] my-5">
            <img src={SeachFilter} className="w-[20px] h-[20px]" />
            <div className="ms-3 text-cardLongContent text-base font-bold">검색 필터</div>
          </div>
        </button>
        {/* 전체 해제 버튼 */}
        <button onClick={clearAllFilters} className="text-cardContent flex items-center gap-1 ">
          <img src={FilterReset} className="w-[20px] h-[20px] text-cardContent" />
          <span className="mr-2  text-sm">필터 해제</span>
        </button>
      </div>

      {/* 적용된 필터 UI */}
      <div className="flex flex-col w-full item-center pb-5">
        <hr className="w-[90%] border-cardSubcontent mb-2 self-center" />
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg font-suite px-5 border-t-5 border-cardContent2">
          {/* 적용된 필터 표시 */}
          {Object.entries(appliedFilters).map(([key, value]) => {
            // isHost가 null인 경우 렌더링하지 않음
            if (key === "isHost" && value === null) {
              return null;
            }

            return (
              <div
                key={key}
                className="flex items-center bg-white border rounded-full px-3 py-1 text-sm text-cardContent2 gap-1.5"
              >
                <span>
                  {key === "isHost"
                    ? value
                      ? "진행자 있음"
                      : "진행자 없음"
                    : key === "dayOfWeek"
                      ? Array.isArray(value)
                        ? value.map((num) => reverseDayMap[num]).join(", ")
                        : reverseDayMap[value as number]
                      : key === "diseaseId"
                        ? Array.isArray(value)
                          ? value.map((num) => reverseDiseaseMap[num]).join(", ")
                          : reverseDiseaseMap[value as number]
                        : key === "startTime"
                          ? `시작 시간 : ${value}시 이후`
                          : key === "endTime"
                            ? `종료 시간 : ${value}시 이전`
                            : key === "startDate" && typeof value === "string" && value.includes("T")
                              ? `시작일 : ${value.split("T")[0]} 이후`
                              : key === "period"
                                ? `기간 : ${value}주`
                                : value}
                </span>
                <button
                  onClick={() => removeFilter(key as keyof RequestData)}
                  className="text-gray-500 hover:text-cardContent2"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <hr className="w-[90%] border-cardSubcontent mt-2 self-center" />
      </div>

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
            activePage={currentPage}
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
