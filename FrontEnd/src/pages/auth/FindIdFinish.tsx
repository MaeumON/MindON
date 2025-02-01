import Button from "@components/common/Button";
import { Wrapper, TextSection } from "@/components/common/DivName";

function FindIdFinish() {
  const userId: string = "ssafy103";
  return (
    <Wrapper className="px-[20px] gap-3">
      <div className="flex flex-col font-bold gap-[60px] w-full ">
        <TextSection className="text-2xl text-center">
          <div>가입한 계정의 아이디는</div>
          <div>{userId}</div>
          <div>입니다.</div>
        </TextSection>
        <Button text={"로그인하기"} type={"GREEN"} />
      </div>
      <section className="flex justify-center text-[16px] text-cardContent font-medium">
        <p>비밀번호를 잊어버리셨나요?</p>
      </section>
    </Wrapper>
  );
}

export default FindIdFinish;
