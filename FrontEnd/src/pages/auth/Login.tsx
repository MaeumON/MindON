import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@components/common/DivName";
import useAuthStore from "@stores/authStore";
import login from "@apis/auth/login";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useNavigate();

  // Zustand에서 상태 업데이트 함수 가져오기
  const setAuth = useAuthStore((state) => state.setAuth);

  function onChangeId(e: React.ChangeEvent<HTMLInputElement>) {
    setUserId(e.target.value);
  }
  function onChangePwd(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function onClickLogin() {
    try {
      const result = await login(userId, password);
      const { accessToken, data } = result;

      // Zustand에 로그인 정보 저장
      setAuth(accessToken, data);
      router("/main");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("회원 정보를 찾을 수 없습니다.");
    }
  }

  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>어서오세요,</div>
          <div>온기를 나눌 준비가 되셨나요?</div>
        </TextSection>
        <Form className="gap-[30px]">
          <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} value={userId} onChange={onChangeId} />
          <InputForm
            type="password"
            title={"비밀번호"}
            titleClassName="text-xl"
            holder={"비밀번호"}
            value={password}
            onChange={onChangePwd}
          />
        </Form>
        <Button text={"로그인"} type={"GREEN"} onClick={onClickLogin} />
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
