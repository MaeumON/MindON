import React, { useState } from "react";
import Button from "../common/Button";
import { checkGroupPwd } from "@/apis/group/groupPwdApi";
import { useNavigate } from "react-router-dom";

const PasswordModal = ({
  selectedGroupId,
  setPasswordModal,
}: {
  selectedGroupId: number;
  setPasswordModal: (passwordModal: boolean) => void;
}) => {
  const nav = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [passwordArray, setPasswordArray] = useState<string[]>([]);

  //입력 글자 수 1글자로 제한
  function inputLenFunc(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length >= 1) {
      e.target.value = e.target.value.slice(0, 1);
    }
  }

  async function fetchCheckPWD() {
    const response = await checkGroupPwd({ groupId: selectedGroupId, password: password });
    if (response) {
      setPasswordModal(false);
      nav(`/groups/${selectedGroupId}`);
    } else if (!response) {
      alert("비밀번호가 틀렸습니다.");
    } else {
      console.log("비밀번호 확인 에러 발생", response.message);
    }
  }

  function handleEnterPWD() {
    if (passwordArray.length === 4) {
      setPassword(passwordArray.join(""));
      fetchCheckPWD();
    } else {
      alert("4자리의 정확한 비밀번호를 입력해 주세요.");
    }
  }

  function handleCancel() {
    setPasswordModal(false);
  }

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(344px,100vw,412px)] h-screen flex items-center justify-center bg-black/50 z-10 ">
      <div className="w-[80%] h-[300px] px-[20px] py-[10px] flex flex-col justify-center items-center bg-offWhite rounded-[12px] font-jamsilRegular text-24px text-center">
        <p className="text-[30px]">비밀번호</p>
        <div className="mt-[25px] flex gap-[15px]">
          <input
            type="number"
            value={passwordArray[0]}
            onInput={inputLenFunc}
            onChange={(e) => {
              const newArray = [...passwordArray];
              newArray[0] = e.target.value;
              setPasswordArray(newArray);
            }}
            className="w-[60px] h-[60px] text-center rounded-[12px] border border-cardContent2"
          />
          <input
            type="number"
            value={passwordArray[1]}
            onInput={inputLenFunc}
            onChange={(e) => {
              const newArray = [...passwordArray];
              newArray[1] = e.target.value;
              setPasswordArray(newArray);
            }}
            className="w-[60px] h-[60px] text-center rounded-[12px] border border-cardContent2"
          />
          <input
            type="number"
            value={passwordArray[2]}
            onInput={inputLenFunc}
            onChange={(e) => {
              const newArray = [...passwordArray];
              newArray[2] = e.target.value;
              setPasswordArray(newArray);
            }}
            className="w-[60px] h-[60px] text-center rounded-[12px] border border-cardContent2"
          />
          <input
            type="number"
            value={passwordArray[3]}
            onInput={inputLenFunc}
            onChange={(e) => {
              const newArray = [...passwordArray];
              newArray[3] = e.target.value;
              setPasswordArray(newArray);
            }}
            className="w-[60px] h-[60px] text-center rounded-[12px] border border-cardContent2"
          />
        </div>
        <div className="mt-[30px] w-[80%] flex gap-[10px]">
          <Button onClick={handleCancel} text="뒤로 가기" type="GRAY" disabled={false} className="text-white" />
          <Button onClick={handleEnterPWD} text="입력하기" type="GREEN" />
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
