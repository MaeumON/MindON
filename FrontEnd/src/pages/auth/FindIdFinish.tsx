import Button from "@/components/common/Button";

function FindIdFinish() {
  const userId: string = "ssafy103";
  return (
    <div className="font-suite flex flex-col items-center justify-center w-full h-screen px-[20px] gap-3">
      <div className="flex flex-col font-bold gap-[60px] w-full text-center">
        <section className="text-2xl ">
          <div>가입한 계정의 아이디는</div>
          <div>{userId}</div>
          <div>입니다.</div>
        </section>
        <Button text={"로그인하기"} type={"GREEN"} />
      </div>
      <section className="flex justify-center text-[16px] text-cardContent font-medium">
        <p>비밀번호를 잊어버리셨나요?</p>
      </section>
    </div>
  );
}

export default FindIdFinish;
