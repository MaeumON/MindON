import InputBox from "@/components/common/InputBox";
import Button from "@/components/common/Button";

function FindId() {
  return (
    <div className="font-suite flex flex-col items-center justify-center w-full h-full px-[20px] gap-[30px]">
      <div className="flex flex-col font-suite font-bold justify-start gap-[60px] w-full">
        <section className="text-2xl ">
          <div>기존에 가입한 계정의</div>
          <div>이름과 이메일을 입력해 주세요.</div>
        </section>
        <section className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-3">
            <div className="text-xl">이름</div>
            <InputBox text={"이름"} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xl">이메일</div>
            <InputBox text={"이메일"} />
          </div>
        </section>
        <Button text={"아이디 찾기"} type={"GREEN"} />
      </div>
    </div>
  );
}

export default FindId;
