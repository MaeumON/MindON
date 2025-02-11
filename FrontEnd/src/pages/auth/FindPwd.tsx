import findPwdApi from "@apis/auth/findPwdApi";
import FindPwdCheck from "@components/auth/FindPwdCheck";
import FindPwdInform from "@components/auth/FindPwdInform";

import React, { useState } from "react";

function FindPwd() {
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState(false);

  function onChangeId(e: React.ChangeEvent<HTMLInputElement>) {
    setUserId(e.target.value);
  }

  function onChangePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
  }

  async function onClickFindPwd() {
    try {
      const result = await findPwdApi(userId, phone);

      // setState가 비동기적으로 작동하므로 동기적으로 처리
      const newState = result[0].data.state;
      setState(newState);

      // 유저 정보 state가 false로 반환되면 실패 알림
      if (!newState) {
        alert("회원 정보를 찾을 수 없습니다.");
        return;
      }
    } catch (error) {
      console.log("비밀번호 찾기 실패:", error);
      alert("회원 정보를 찾을 수 없습니다.");
    }
  }

  const checkProps = {
    userId,
    phone,
    onChangeId,
    onChangePhone,
    onClickFindPwd,
  };

  return <div>{!state ? <FindPwdCheck {...checkProps} /> : <FindPwdInform userId={userId as string} />}</div>;
}

export default FindPwd;
