import InputBox from "@/components/common/InputBox";
import Button from "@/components/common/Button";

function Login() {
  return (
    <div className="font-suite flex flex-col items-center justify-center w-full h-full px-[20px] gap-[30px]">
      <div className="flex flex-col font-suite font-bold justify-start gap-[60px] w-full">
        <section className="text-2xl ">
          <div>어서오세요,</div>
          <div>온기를 나눌 준비가 되셨나요?</div>
        </section>
        <section className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-3">
            <div className="text-xl">아이디</div>
            <InputBox />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xl">비밀번호</div>
            <input
              type="password"
              className="grow shrink basis-0 font-suite rounded-xl py-3 px-4 text-cardLongContent bg-White text-lg justify-start items-center font-bold whitespace-nowrap w-full outline-none border-2 focus:border-yellow100 focus:border-yellow100  focus:ring-0.5 focus:ring-yellow100"
            />
          </div>
        </section>
        <Button text={"로그인"} type={"GREEN"} />
      </div>
      <section className="flex flex-col text-[16px] gap-2 text-cardContent font-medium">
        <p>아이디를 잊어버리셨나요?</p>
        <p>비밀번호를 잊어버리셨나요?</p>
        <p>아직 계정이 없으신가요?</p>
      </section>
    </div>
  );
}

export default Login;
