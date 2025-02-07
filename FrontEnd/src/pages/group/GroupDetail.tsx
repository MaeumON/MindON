import Introbear from "@assets/images/introbear.png";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import Button from "@components/common/Button";

function GroupDetail() {
  return (
    <div className="pb-[74px]">
      <div className="flex flex-col gap-5">
        <Header title={"모임 상세보기"} isicon={true} className="bg-offWhite" />

        {/* 모임 상세정보 박스 */}
        <div className="flex flex-col font-suite items-start justify-center mx-5  mb-[100px] pt-6 bg-white rounded-xl gap-5 inline-flex overflow-hidden">
          <div className="px-5 justify-start items-center gap-2.5 inline-flex">
            {/* 질병 버튼 */}
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">질병명</div>
            </div>
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">월요일</div>
            </div>
            <div className="relative w-fit px-3.5 py-1 bg-white rounded-2xl border border-cardSubcontent">
              <div className="text-center text-cardContent text-sm md:text-base font-bold">17시</div>
            </div>
          </div>
          {/* 모임 정보 */}
          <div className="flex-col justify-start items-start gap-10 flex">
            {/* 모임 타이틀 */}
            <div className="px-5 justify-start items-start gap-2.5 inline-flex">
              <div className="text-cardTitle text-[32px] font-jamsilMedium">치매 환자 간병인 모임</div>
            </div>
            {/* 모임 소개 */}
            <div className="flex-col justify-start items-start flex gap-10">
              <div className="flex-col justify-start items-start flex">
                <div className=" px-5 justify-start items-center gap-2.5 inline-flex">
                  <div className="text-cardTitle text-2xl font-jamsilMedium">모임 소개</div>
                </div>
                <div className=" px-8 py-2.5 rounded-2xl justify-start items-start gap-2.5 inline-flex">
                  <div className="text-cardLongContent text-lg font-medium leading-[35px]">
                    치매 환자 간병으로 힘든 사람들을 위한 모임
                    <br />
                    진솔하게 대화하실 분 찾아요.
                    <br />
                    서로의 이야기에 경청해주는 매너 부탁드려요
                  </div>
                </div>
              </div>
              {/* 모임 정보 */}
              <div className="flex-col justify-start items-start flex">
                <div className=" px-5 justify-start items-center gap-2.5 inline-flex">
                  <div className="text-cardTitle text-2xl font-jamsilMedium">모임 정보</div>
                </div>
                <div className="px-5 py-2.5 justify-start items-start gap-2.5 inline-flex leading-[35px] text-lg">
                  <div className="grow shrink basis-0 px-3">
                    <span className="text-[#d98600] text-lg font-bold ">“치매”</span>
                    <span className="text-cardLongContent text-lg font-medium">
                      라는 주제로 이야기해요
                      <br />
                      매주
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">월요일 17시</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      에 만나요
                      <br />
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">1월 21일 월요일부터 시작</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      해요
                      <br />
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">최소 3명 이상 최대 6명 이하</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      로 참여해요
                      <br />
                      모임의{" "}
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">진행은 온이</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">
                      가 해줄거에요
                      <br />
                      누구나 들어올 수 있는{" "}
                    </span>
                    <span className="text-[#d98600] text-lg font-bold leading-[35px]">공개방</span>
                    <span className="text-cardLongContent text-lg font-medium leading-[35px]">이에요</span>
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
        <Button
          text={"참여하기"}
          type="GREEN"
          className="mb-10 fixed bottom-[60px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[392px] w-auto shadow-lg "
        />
      </div>
      <Footer />
    </div>
  );
}

export default GroupDetail;
