import React from "react";

import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

interface checkProps {
  userName: string;
  phone: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickFindId: () => void;
}

function FindIdCheck({ userName, phone, onChangeName, onChangePhone, onClickFindId }: checkProps) {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] items-center justify-center flex-grow  w-full">
        <TextSection className="text-2xl w-full">
          <div>기존에 가입한 계정의</div>
          <div>이름과 전화번호를 입력해 주세요.</div>
        </TextSection>
        <Form className="gap-[30px] w-full">
          <InputForm title={"이름"} titleClassName="text-xl" holder={"이름"} value={userName} onChange={onChangeName} />
          <InputForm
            title={"전화번호"}
            titleClassName="text-xl"
            holder={"01012345678"}
            value={phone}
            onChange={onChangePhone}
          />
        </Form>
        <Button text={"아이디 찾기"} type={"GREEN"} onClick={onClickFindId} />
      </div>
    </Wrapper>
  );
}

export default FindIdCheck;
