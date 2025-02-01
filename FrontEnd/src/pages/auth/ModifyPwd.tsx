import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

function ModifyPwd() {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>새로운 비밀번호를</div>
          <div>입력해 주세요.</div>
        </TextSection>
        <Form className="gap-[30px]">
          <InputForm
            title={"새 비밀번호"}
            type="password"
            titleClassName="text-xl"
            holder={"8자 이상 / 영어, 숫자 필수"}
          />
          <InputForm
            title={"새 비밀번호 확인"}
            type="password"
            titleClassName="text-xl"
            holder={"8자 이상 / 영어, 숫자 필수"}
          />
        </Form>
        <Button text={"비밀번호 수정"} type={"GREEN"} />
      </div>
    </Wrapper>
  );
}

export default ModifyPwd;
