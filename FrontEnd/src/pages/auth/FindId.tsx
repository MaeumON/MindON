import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

function FindId() {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>기존에 가입한 계정의</div>
          <div>이름과 이메일을 입력해 주세요.</div>
        </TextSection>
        <Form className="gap-[30px]">
          <InputForm title={"이름"} titleClassName="text-xl" holder={"이름"} />
          <InputForm title={"이메일"} titleClassName="text-xl" holder={"mindion@mindon.com"} />
        </Form>
        <Button text={"아이디 찾기"} type={"GREEN"} />
      </div>
    </Wrapper>
  );
}

export default FindId;
