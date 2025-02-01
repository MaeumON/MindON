import InputForm from "@components/common/InputForm";
import { Wrapper, Form } from "@components/common/DivName";
import Button from "@components/common/Button";
import DiseaseDrop from "@components/common/DiseaseDrop";

function SignUp() {
  return (
    <Wrapper className="p-[30px]  gap-[30px] pb-[50px]">
      <Form className="font-bold  gap-[20px] w-full">
        <InputForm title={"이름"} titleClassName="text-xl" holder={"이름"} />
        <InputForm title={"이메일"} titleClassName="text-xl" holder={"mindion@mindon.com"} />
        <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} />
        <InputForm title={"비밀번호"} type="password" titleClassName="text-xl" holder={"비밀번호"} />
        <InputForm title={"비밀번호 확인"} type="password" titleClassName="text-xl" holder={"비밀번호 확인"} />
        <InputForm title={"전화번호"} titleClassName="text-xl" holder={"전화번호"} />
        <DiseaseDrop title="관심 주제(질병)" />
      </Form>
      <Button text={"회원가입"} type={"GREEN"} />
    </Wrapper>
  );
}

export default SignUp;
