import React, { useState } from "react";

import findIdApi from "@/apis/auth/findIdApi";
import FindIdCheck from "@components/auth/FindIdCheck";
import FindIdInform from "@/components/auth/FindIdInform";

function FindId() {
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [check, setCheck] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // userId가 없는 경우 구분 위해 null 사용

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  function onChangePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
  }

  async function onClickFindId() {
    try {
      const result = await findIdApi(userName, phone);
      console.log("result:", result);

      // userId가 null 값이면 알림
      if (!result.userId) {
        alert("회원 정보를 찾을 수 없습니다.");
        return;
      }

      setUserId(result.userId);
      setCheck(true);
    } catch (error) {
      console.log("아이디찾기 실패:", error);
      alert("회원 정보를 찾을 수 없습니다.");
    }
  }

  const checkProps = {
    userName,
    phone,
    onChangeName,
    onChangePhone,
    onClickFindId,
  };

  return <div>{!check ? <FindIdCheck {...checkProps} /> : <FindIdInform userId={userId as string} />}</div>;
}

export default FindId;
