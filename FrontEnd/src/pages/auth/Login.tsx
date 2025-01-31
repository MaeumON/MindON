import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

function Login() {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>어서오세요,</div>
          <div>온기를 나눌 준비가 되셨나요?</div>
        </TextSection>
        <Form className="gap-[30px]">
          <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} />
          <InputForm type="password" title={"비밀번호"} titleClassName="text-xl" holder={"비밀번호"} />
        </Form>
        <Button text={"로그인"} type={"GREEN"} />
      </div>
      <section className="flex flex-col text-[16px] gap-2 text-cardContent font-medium">
        <p>아이디를 잊어버리셨나요?</p>
        <p>비밀번호를 잊어버리셨나요?</p>
        <p>아직 계정이 없으신가요?</p>
      </section>
    </Wrapper>
  );
}

export default Login;
