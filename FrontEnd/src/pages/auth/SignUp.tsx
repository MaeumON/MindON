import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "@components/common/InputForm";
import { Wrapper, Form } from "@components/common/DivName";
import Button from "@components/common/Button";
import DiseaseDrop from "@components/common/DiseaseDrop";
import signup from "@apis/auth/signUp";

function SignUp() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [diseaseId, setDiseaseId] = useState<number | null>(null); // 질병 선택 전 null 값

  const router = useNavigate();
  async function handleSignUp() {
    if (!userId || !email || !userName || !password || !phone || diseaseId === null) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const requestData = {
      userId,
      email,
      userName,
      password,
      phone,
      diseaseId,
    };

    try {
      await signup(requestData);
      alert("회원가입이 완료되었습니다!");
      console.log(diseaseId);
      router("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입에 실패했습니다.");
    }
  }

  const onChangeUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }, []);

  const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const onChangeUserId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const onChangePasswordCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  }, []);

  const onChangePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }, []);

  return (
    <Wrapper className="p-[30px]  gap-[30px] pb-[50px]">
      <Form className="font-bold  gap-[20px] w-full">
        <InputForm
          title={"이름"}
          titleClassName="text-xl"
          holder={"이름"}
          value={userName}
          onChange={onChangeUserName}
        />
        <InputForm
          title={"이메일"}
          titleClassName="text-xl"
          holder={"mindion@mindon.com"}
          value={email}
          onChange={onChangeEmail}
        />
        <InputForm
          title={"아이디"}
          titleClassName="text-xl"
          holder={"아이디"}
          value={userId}
          onChange={onChangeUserId}
        />
        <InputForm
          title={"비밀번호"}
          type="password"
          titleClassName="text-xl"
          holder={"비밀번호"}
          value={password}
          onChange={onChangePassword}
        />
        <InputForm
          title={"비밀번호 확인"}
          type="password"
          titleClassName="text-xl"
          holder={"비밀번호 확인"}
          value={passwordCheck}
          onChange={onChangePasswordCheck}
        />
        <InputForm
          title={"전화번호"}
          titleClassName="text-xl"
          holder={"전화번호"}
          value={phone}
          onChange={onChangePhone}
        />

        <DiseaseDrop title="관심 질병" value={diseaseId} onSelect={setDiseaseId} />
      </Form>
      <Button text="회원가입" type="GREEN" onClick={handleSignUp} />
    </Wrapper>
  );
}

export default SignUp;
