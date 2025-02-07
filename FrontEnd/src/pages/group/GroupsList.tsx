import Header from "@components/Layout/Header";
import GroupCard from "@/components/group/GroupCard";
import SearchReadingGlasses from "@assets/images/SearchReadingGlasses.png";
import SeachFilter from "@assets/images/SeachFilter.png";
import Footer from "@/components/Layout/Footer";
import GroupsFilter from "@components/group/GroupsFilter";
import { useState } from "react";

function GroupsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
        <div className="flex flex-1 left-[30px] my-5 ml-6 ">
          <img src={SeachFilter} className="w-[20px] h-[20px]" />
          <div className="ms-3 text-cardLongContent text-base font-bold font-suite">검색 필터</div>
        </div>
      </button>
      {/* 그룹 목록 - 그룹 없을때 대비 컴포넌트로 변환해야함*/}
      <div className="flex flex-col gap-5 pb-20">
        <GroupCard />
        <GroupCard />
        <GroupCard />
        <GroupCard />
        <GroupCard />
      </div>
      {/* 모달 */}
      {isFilterOpen && <GroupsFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />}

      <Footer />
    </div>
  );
}

export default GroupsList;
