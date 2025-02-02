import React from "react";

import InputForm from "@components/common/InputForm";
import Button from "@components/common/Button";
import { Wrapper, Form, TextSection } from "@/components/common/DivName";

interface checkProps {
  userName: string;
  email: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickFindId: () => void;
}

function FindIdCheck({ userName, email, onChangeName, onChangeEmail, onClickFindId }: checkProps) {
  return (
    <Wrapper className="px-[20px] gap-[30px]">
      <div className="flex flex-col font-bold gap-[60px] items-center justify-center flex-grow  w-full">
        <TextSection className="text-2xl w-full">
          <div>기존에 가입한 계정의</div>
          <div>이름과 이메일을 입력해 주세요.</div>
        </TextSection>
        <Form className="gap-[30px] w-full">
          <InputForm title={"이름"} titleClassName="text-xl" holder={"이름"} value={userName} onChange={onChangeName} />
          <InputForm
            title={"이메일"}
            titleClassName="text-xl"
            holder={"mindion@mindon.com"}
            value={email}
            onChange={onChangeEmail}
          />
        </Form>
        <Button text={"아이디 찾기"} type={"GREEN"} onClick={onClickFindId} />
      </div>
    </Wrapper>
  );
}

export default FindIdCheck;
