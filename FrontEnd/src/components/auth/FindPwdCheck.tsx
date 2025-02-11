import React from "react";

import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

interface checkProps {
  userId: string;
  phone: string;
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickFindPwd: () => void;
}

// 싹 걷어내고 onClick 함수만 props하려 했으나 FindPwd 페이지에 axios로 전달해줄 값이 빵꾸가 나서 결국 다 props 함

function FindPwdCheck({ userId, phone, onChangeId, onChangePhone, onClickFindPwd }: checkProps) {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] w-full">
        <TextSection className="text-2xl ">
          <div>기존에 가입한 계정의</div>
          <div>이름과 전화번호를 입력해 주세요.</div>
        </TextSection>
        <Form className="flex flex-col gap-[30px]">
          <InputForm title={"아이디"} titleClassName="text-xl" holder={"아이디"} value={userId} onChange={onChangeId} />
          <InputForm
            title={"전화번호"}
            titleClassName="text-xl"
            holder={"01012345678"}
            value={phone}
            onChange={onChangePhone}
          />
        </Form>
        <Button text={"비밀번호 찾기"} type={"GREEN"} onClick={onClickFindPwd} />
      </div>
    </Wrapper>
  );
}

export default FindPwdCheck;
