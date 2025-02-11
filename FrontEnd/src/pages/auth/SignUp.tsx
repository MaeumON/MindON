import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "@components/common/InputForm";
import { Wrapper, Form } from "@components/common/DivName";
import Button from "@components/common/Button";
import DiseaseDrop from "@components/common/DiseaseDrop";
import signUpApi from "@/apis/auth/signUpApi";

function SignUp() {
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [diseaseId, setDiseaseId] = useState<number | null>(null); // 질병 선택 전 null 값

  // 비밀번호, 확인
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");

  // 비밀번호 오류 메시지
  const [msg, setMsg] = useState("");
  const [checkMsg, setCheckMsg] = useState("");

  //비밀번호 유효성 검사
  const [isPwd, setIsPwd] = useState(false);
  const [isPwdCheck, setIsPwdCheck] = useState(false);

  // 전화번호 오류 메시지
  const [phoneMsg, setPhoneMsg] = useState("");

  // 전화번호 유효성 검사
  const [isPhone, setIsPhone] = useState(false);

  const router = useNavigate();
  async function handleSignUp() {
    if (!userId || !userName || !password || !phone || diseaseId === null) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const requestData = {
      userId,
      userName,
      password,
      phone,
      diseaseId,
    };

    try {
      await signUpApi(requestData);
      alert("회원가입이 완료되었습니다");
      console.log(requestData);
      router("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입에 실패했습니다.");
    }
  }

  // 이름
  const onChangeUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }, []);

  // 아이디
  const onChangeUserId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  }, []);

  // 비밀번호
  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,25}$/;
    const pwdCurrent = e.target.value;
    setPassword(pwdCurrent);

    if (!pwdRegex.test(pwdCurrent)) {
      setMsg("영어, 숫자 필수 / 8자리 이상 입력해주세요");
      setIsPwd(false);
    } else {
      setMsg("안전한 비밀번호입니다");
      setIsPwd(true);
    }
  }, []);

  // 비밀번호 확인
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pwdCheckCurrent = e.target.value;
      setPasswordCheck(pwdCheckCurrent);

      if (password !== pwdCheckCurrent) {
        setCheckMsg("비밀번호가 일치하지 않습니다.");
        setIsPwdCheck(false);
      } else {
        setCheckMsg("비밀번호가 일치합니다");
        setIsPwdCheck(true);
      }
    },
    [password]
  );

  // 전화번호
  const onChangePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRegex = /^[0-9]{8,15}$/; // 숫자만 허용
    const phoneCurrent = e.target.value;
    setPhone(phoneCurrent);

    if (!phoneRegex.test(phoneCurrent)) {
      setPhoneMsg("숫자만 입력해주세요");
      setIsPhone(false);
    } else {
      setPhoneMsg("올바른 입력입니다");
      setIsPhone(true);
    }
  }, []);

  return (
    <Wrapper className="p-[30px]  gap-[30px] pb-[80px]">
      <Form className="font-bold  gap-[20px] pb-[20px] w-full">
        <InputForm
          title={"이름"}
          titleClassName="text-xl"
          holder={"이름"}
          value={userName}
          onChange={onChangeUserName}
        />
        <span></span>
        <InputForm
          title={"아이디"}
          titleClassName="text-xl"
          holder={"아이디"}
          value={userId}
          onChange={onChangeUserId}
        />
        <span></span>
        <InputForm
          title={"비밀번호"}
          type="password"
          titleClassName="text-xl"
          holder={"비밀번호"}
          value={password}
          onChange={onChangePassword}
        />
        <span className={`text-sm pl-2 ${isPwd ? "text-green100" : "text-red-500"}`}>{msg}</span>
        <InputForm
          title={"비밀번호 확인"}
          type="password"
          titleClassName="text-xl"
          holder={"비밀번호 확인"}
          value={passwordCheck}
          onChange={onChangePasswordCheck}
        />
        <span className={`text-sm pl-2 ${isPwdCheck ? "text-green100" : "text-red-500"}`}>{checkMsg}</span>
        <InputForm
          title={"전화번호"}
          titleClassName="text-xl"
          holder={"01012341234"}
          value={phone}
          onChange={onChangePhone}
        />
        <span className={`text-sm pl-2 ${isPhone ? "text-green100" : "text-red-500"}`}>{phoneMsg}</span>

        <DiseaseDrop title="관심 질병" value={diseaseId} onSelect={setDiseaseId} />
      </Form>
      <Button text="회원가입" type="GREEN" onClick={handleSignUp} />
    </Wrapper>
  );
}

export default SignUp;
