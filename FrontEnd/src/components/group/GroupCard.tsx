const GroupCard = () => {
  return (
    <div className="flex justify-center items-center w-full px-4">
      <div className="font-suite h-auto p-5 bg-white rounded-xl shadow-md flex flex-col justify-center items-start gap-3 w-full max-w-[600px]">
        {/* 질병 버튼 */}
        <div className="relative w-fit px-2.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
          <div className="text-center text-cardContent text-sm md:text-base font-bold">질병명</div>
        </div>

        {/* 그룹 정보 */}
        <div className="flex flex-col justify-start items-start w-full gap-2">
          <div className="text-cardTitle text-lg md:text-xl font-bold truncate w-full">
            독산동 백반증 환자들만 모여랏
          </div>
          <div className="flex flex-wrap justify-start items-center gap-x-2 gap-y-1 w-full">
            <div className="text-cardContent2 text-sm md:text-base font-semibold">일정</div>
            <div className="text-cardTitle text-sm md:text-base font-semibold">1/27 부터</div>
            <div className="text-cardTitle text-sm md:text-base font-semibold">매주</div>
            <div className="text-[#d98600] text-sm md:text-base font-semibold">월요일</div>
            <div className="text-cardTitle text-sm md:text-base font-semibold">17시</div>
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div className="text-cardContent2 text-sm md:text-base font-semibold">참여인원</div>
            <div>
              <span className="text-[#d98600] text-sm md:text-base font-semibold">3</span>
              <span className="text-cardTitle text-sm md:text-base font-semibold"> / 6명</span>
            </div>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <div className="w-full h-[40px] bg-[#6bb07c] rounded-xl flex justify-center items-center">
          <div className="text-white text-sm md:text-base font-bold">상세보기</div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
