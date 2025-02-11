import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";

import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@components/common/DivName";
import useAuthStore from "@stores/authStore";
import loginApi from "@/apis/auth/loginApi";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const router = useNavigate();

  // Zustand에서 상태 업데이트 함수 가져오기
  const setAuth = useAuthStore((state) => state.setAuth);

  function onChangeId(e: React.ChangeEvent<HTMLInputElement>) {
    setId(e.target.value);
  }
  function onChangePwd(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function onClickLogin() {
    try {
      const result = await loginApi(id, password);
      const { accessToken, refreshToken, userId, userName, diseaseId, diseaseName } = result;
      console.log("API result :", result);

      // Zustand에 로그인 정보 저장
      setAuth({ accessToken, refreshToken, userId, userName, diseaseId, diseaseName });
      router("/main");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; code: string }>;

        if (axiosError.response) {
          const { status, data } = axiosError.response;

          if (status === 401 && data.code === "U2") {
            alert("비밀번호가 일치하지 않습니다.");
          } else if (status === 404 && data.code === "U1") {
            alert("존재하지 않는 아이디입니다.");
          } else if (status === 403 && data.code === "U5") {
            alert("계정이 정지되었습니다.");
          } else {
            alert("로그인 중 알 수 없는 오류가 발생했습니다.");
          }
        } else {
          console.error("로그인 요청 실패:", error);
          alert("네트워크 오류 또는 서버 문제가 발생했습니다.");
        }
      }
    }
  }

  // 검색 실행(엔터키)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      onClickLogin();
    }
  };

  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>어서오세요,</div>
          <div>온기를 나눌 준비가 되셨나요?</div>
        </TextSection>
        <Form className="gap-[30px]">
          <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} value={id} onChange={onChangeId} />
          <InputForm
            type="password"
            title={"비밀번호"}
            titleClassName="text-xl"
            holder={"비밀번호"}
            value={password}
            onChange={onChangePwd}
          />
        </Form>
        <Button text={"로그인"} type={"GREEN"} onClick={onClickLogin} onKeyDown={handleKeyDown} />
      </div>

      <section className="flex flex-col text-center  text-[16px] gap-2 text-cardContent font-medium">
        <div
          className="cursor-pointer underline text-semibold decoration-cardContent2"
          onClick={() => router("/findid")}
        >
          아이디 찾기
        </div>
        <div
          className="cursor-pointer underline text-semibold decoration-cardContent2"
          onClick={() => router("/findpwd")}
        >
          비밀번호 찾기
        </div>
        <div
          className="cursor-pointer underline text-semibold decoration-cardContent2"
          onClick={() => router("/signup")}
        >
          회원 가입
        </div>
      </section>
    </Wrapper>
  );
}

export default Login;
