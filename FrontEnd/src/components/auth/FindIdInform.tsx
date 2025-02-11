import Button from "@components/common/Button";
import { Wrapper, TextSection } from "@/components/common/DivName";
import { useNavigate } from "react-router-dom";

interface InformProps {
  userId: string;
}
// 아이디 마스킹 함수
function maskUserId(userId: string): string {
  const visiblePart = userId.slice(0, 3); // 앞 3글자
  const maskedPart = "*".repeat(Math.max(userId.length - 3, 0)); // 나머지 부분을 '*'
  return visiblePart + maskedPart;
}

function FindIdInform({ userId }: InformProps) {
  const router = useNavigate();
  return (
    <Wrapper className="px-[20px] gap-3">
      <div className="flex flex-col font-bold gap-[60px] w-full ">
        <TextSection className="text-2xl text-center">
          <div>가입한 계정의 아이디는</div>
          <div>{maskUserId(userId)}</div>
          <div>입니다.</div>
        </TextSection>
        <Button text={"로그인하기"} type={"GREEN"} />
      </div>
      <section className="flex justify-center text-[16px] text-cardContent font-medium">
        <div
          className="cursor-pointer underline text-semibold decoration-cardContent2"
          onClick={() => router("/findpwd")}
        >
          비밀번호를 잊어버리셨나요?
        </div>
      </section>
    </Wrapper>
  );
}
export default FindIdInform;
