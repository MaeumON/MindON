import InputBox from "@/components/common/InputBox";
import Button from "@/components/common/Button";

function ModifyPwd() {
  return (
    <div className="font-suite flex flex-col items-center justify-center w-full h-full px-[20px] gap-[30px]">
      <div className="flex flex-col font-suite font-bold justify-start gap-[60px] w-full">
        <section className="text-2xl ">
          <div>새로운 비밀번호를</div>
          <div>입력해 주세요.</div>
        </section>
        <section className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-3">
            <div className="text-xl">새 비밀번호</div>
            <InputBox text={"8자 이상/영어,숫자 필수"} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xl">새 비밀번호 확인</div>
            <InputBox text={"8자 이상/영어,숫자 필수"} />
          </div>
        </section>
        <Button text={"비밀번호 수정"} type={"GREEN"} />
      </div>
    </div>
  );
}

export default ModifyPwd;
