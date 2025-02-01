import IllCaption from "@/components/common/IllCaption";
import Button from "@/components/common/Button";

function Main() {
  let userName = "이하영";

  interface Dics {
    date?: string;
    starttime?: string;
    endtime?: string;
    title?: string;
  }

  const UpCommingEvent: Dics | null = null;
  //   const UpCommingEvent: Dics | null = {
  //     date: "1월 27일 월",
  //     starttime: "20:00",
  //     endtime: "20:50",
  //     title: "소아암 부모 모임 입니다",
  //   };

  return (
    <div>
      <section className="flex flex-col gap-[20px] bg-yellow100 card-title h-[245px] px-[40px] py-[40px]">
        <section className="flex flex-col gap-[10px] justify-center flex-start items-stretch">
          <div className="font-jamsilMedium text-[28px] text-cardTitle">안녕하세요, {userName}님</div>
          <div className="font-jamsilRegular text-[24px] text-cardTitle">오늘도 온이와 함께</div>
          <div className="font-jamsilRegular text-[24px]">마음을 ON 해볼까요?</div>
        </section>

        <section className="p-5 bg-white rounded-[12px] shadow-[0px_1px_10px_0px_rgba(221,221,221,1.00)] justify-center items-center">
          <div className="flex flex-col gap-[10px]">
            <div>
              <IllCaption />
            </div>
            <div className="flex-col items-start gap-[5px] flex">
              {UpCommingEvent ? (
                <>
                  <div className="font-suite font-bold text-[18px] text-cardLongContent">
                    {UpCommingEvent["date"] ?? "날짜미정"}
                  </div>
                  <div className="font-suite font-bold text-[18px] text-orange100">{`${UpCommingEvent["starttime"] ?? "시간미정"}-${UpCommingEvent["endtime"] ?? "시간미정"}`}</div>
                  <div className="font-suite font-extrabold text-[24px] text-cardLongContent">
                    {UpCommingEvent["title"] ?? "제목없음"}
                  </div>
                  <div>
                    <Button text={"입장하기"} type={"GREEN"} />
                  </div>
                </>
              ) : (
                <>
                  <div className="font-suite text-[24px] font-semibold text-cardLongContent">
                    오늘은 예정된 모임이 없어요.
                  </div>
                  <div className="font-suite text-[24px] font-bold text-orange100">새로 마음을 나누러 가볼까요?</div>
                </>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default Main;
