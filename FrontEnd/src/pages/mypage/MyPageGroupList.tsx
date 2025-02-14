import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";

import Footer from "@components/Layout/Footer";
import { Group } from "@utils/groups";
import React from "react";

import IconSearch from "@assets/icons/IconSearch";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { groupStatusApi } from "@/apis/group/groupListApi";

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

  useEffect(() => {
    console.log("📌 groups 상태 변경됨:", groups);
  }, [groups]);
  // ✅ 필터
  // 필터 상태 관리를 위한 변수들
  // const [selectedFilters, setSelectedFilters] = useState<RequestData>({
  //   diseaseId: [],
  //   isHost: null,
  //   startDate: new Date().toISOString().split("T")[0] + "T00:00:00Z",
  //   period: 0,
  //   startTime: 0,
  //   endTime: 23,
  //   dayOfWeek: [],
  // });
  // 필터가 적용된 API 요청을 받으면 실행됨
  // const handleApplyFilter = async (filters: Partial<RequestData>) => {
  //   try {
  //     setSelectedFilters(filters); // 필터 상태 저장
  //     const result = await groupListApi(filters);
  //     setGroups(result); // 기존 그룹 목록을 새로운 목록으로 갱신
  //     // console.log("📌 필터 적용 API 응답:", result);
  //   } catch (error) {
  //     console.error("필터 적용 후 그룹 목록 요청 실패:", error);
  //   }
  // };
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
    <div>
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
