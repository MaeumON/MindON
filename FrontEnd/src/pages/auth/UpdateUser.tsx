import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import InputForm from "@components/common/InputForm";
import { Wrapper, Form } from "@components/common/DivName";
import Button from "@components/common/Button";
import DiseaseDrop from "@components/common/DiseaseDrop";
import useAuthStore from "@stores/authStore";
import updateUserApi, { getUserInfoApi, UpdateUserData, UserInfo } from "@apis/auth/updateUserApi";
import deleteUserApi from "@apis/auth/deleteUserApi";

function UpdateUser() {
  // User정보 가져오기
  const { userId, userName, diseaseId: preDiseaseId } = useAuthStore();

  const [phone, setPhone] = useState<string>("");
  const [diseaseId, setDiseaseId] = useState<number>();

  // 초기 렌더링 시 이전에 선택한 질병을 기본값으로 설정
  useEffect(() => {
    if (preDiseaseId) {
      setDiseaseId(preDiseaseId);
    }
  }, []);

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
    //  변경된 값만 담을 객체 생성
    const requestData: UpdateUserData = {};

    if (password) requestData.password = password;
    if (phone) requestData.phone = phone;
    if (diseaseId !== preDiseaseId) requestData.diseaseId = diseaseId;

    //  변경된 값이 없으면 요청 안 함
    if (Object.keys(requestData).length === 0) {
      alert("수정된 정보가 없습니다.");
      return;
    }

    try {
      await updateUserApi(requestData);
      alert("회원 정보가 수정되었습니다.");
      console.log(requestData);
      router("/mypage");
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      alert("회원 정보 수정에 실패했습니다.");
    }
  }

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

  // 회원 탈퇴

  const onClickDelete = useCallback(async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      try {
        const status = await deleteUserApi();
        if (status === 200) {
          // 성공적으로 삭제된 경우만 처리
          alert("회원 탈퇴가 완료되었습니다.");
          useAuthStore.getState().logout(); // 로그인 상태 초기화
          router("/login"); // 로그인 페이지로 이동
        }
      } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  }, [router]);

  async function fetchUserInfo(): Promise<UserInfo> {
    const userInfo = await getUserInfoApi();

    setPhone(userInfo.phone);
    setDiseaseId(userInfo.diseaseId);
    return userInfo;
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      <Header title={"회원정보수정"} isicon={true} />
      <Wrapper className="p-[30px]  gap-[30px] pb-[150px]">
        <Form className="font-bold  gap-[20px] pb-[20px] w-full">
          <InputForm title={"이름"} titleClassName="text-xl" holder={"이름"} value={userName} disabled />
          <span></span>
          <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} value={userId} disabled />
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
        <Button text="회원정보 수정" type="GREEN" onClick={handleSignUp} />
        <div
          className="cursor-pointer text-cardContent underline text-semibold decoration-cardContent2"
          onClick={onClickDelete}
        >
          회원 탈퇴
        </div>
      </Wrapper>
    </>
  );
}

export default UpdateUser;
