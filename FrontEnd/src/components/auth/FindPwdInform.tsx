import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@components/common/DivName";
import React, { useCallback, useState } from "react";
import changePwdApi from "@apis/auth/changePwdApi";
import { useNavigate } from "react-router-dom";

// axios 보낼 때 필요한 userId
interface InformProps {
  userId: string;
}

function FindPwdInform({ userId }: InformProps) {
  const router = useNavigate();
  const [pwd, setPwd] = useState("");
  const [pwdCheck, setPwdCheck] = useState("");
  // 오류 메시지
  const [msg, setMsg] = useState("");
  const [checkMsg, setCheckMsg] = useState("");
  //유효성 검사
  const [isPwd, setIsPwd] = useState(false);
  const [isPwdCheck, setIsPwdCheck] = useState(false);

  // 비밀번호
  const onChangePwd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,25}$/;
    const pwdCurrent = e.target.value;
    setPwd(pwdCurrent);

    if (!pwdRegex.test(pwdCurrent)) {
      setMsg("영어, 숫자 필수 / 8자리 이상 입력해주세요");
      setIsPwd(false);
    } else {
      setMsg("안전한 비밀번호입니다");
      setIsPwd(true);
    }
  }, []);

  // 비밀번호 확인
  const onChangePwdCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pwdCheckCurrent = e.target.value;
      setPwdCheck(pwdCheckCurrent);

      if (pwd !== pwdCheckCurrent) {
        setCheckMsg("비밀번호가 일치하지 않습니다.");
        setIsPwdCheck(false);
      } else {
        setCheckMsg("비밀번호가 일치합니다");
        setIsPwdCheck(true);
      }
    },
    [pwd]
  );

  async function handlePwdChange() {
    if (!isPwd || !isPwdCheck) {
      alert("유효한 비밀번호를 입력해주세요");
      return;
    }

    const requestData = {
      userId,
      password: pwd,
    };

    try {
      await changePwdApi(requestData);
      alert("비밀번호 수정이 완료되었습니다");
      router("/login");
    } catch (error) {
      console.error("비밀번호수정 오류 :", error);
      alert("비밀번호 수정에 실패했습니다.");
    }
  }

  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl">
          <div>새로운 비밀번호를</div>
          <div>입력해 주세요.</div>
        </TextSection>
        <Form className="gap-[10px]">
          <InputForm
            title={"새 비밀번호"}
            type="password"
            titleClassName="text-xl"
            holder={"8자 이상 / 영어, 숫자 필수"}
            onChange={onChangePwd}
            value={pwd}
          />
          <span className={`text-sm pb-5 pl-2 ${isPwd ? "text-green100" : "text-red-500"}`}>{msg}</span>
          <InputForm
            title={"새 비밀번호 확인"}
            type="password"
            titleClassName="text-xl"
            holder={"8자 이상 / 영어, 숫자 필수"}
            onChange={onChangePwdCheck}
            value={pwdCheck}
          />
          <span className={`text-sm pl-2 ${isPwdCheck ? "text-green100" : "text-red-500"}`}>{checkMsg}</span>
        </Form>
        <Button text={"비밀번호 수정"} type={"GREEN"} onClick={handlePwdChange} />
      </div>
    </Wrapper>
  );
}

export default FindPwdInform;
