import { Wrapper } from "@components/common/DivName";
import Button from "@components/common/Button";
import { useNavigate } from "react-router-dom";
import hellowbear from "@/assets/images/bear/hellowbear.png";

function Welcome() {
  const router = useNavigate();

  return (
    <Wrapper className="bg-yellow100 px-5 gap-3 inline-flex">
      {/* 전체 div 세로 정렬 */}
      <div className="flex flex-col w-full ">
        {/* 로고+곰 가로배치*/}
        <div className="flex">
          <div className="flex justify-center items-center pl-[100px]">
            {/* <img src={logo_mindon} alt="마음 ON" /> */}
            <p className="font-jamsilExtraBold text-white text-[40px] [text-shadow:_4px_2px_0_#828282]">마음ON</p>
          </div>
          <img src={hellowbear} alt="온이가 환영해요" className="w-[120px] h-[100px] justify-end" />
        </div>
        <div className="w-full flex flex-col items-center gap-6  align-self-stretch">
          <Button
            text={"로그인"}
            type="GREEN"
            onClick={() => {
              router("/login");
            }}
          />
          <Button
            text={"회원가입"}
            type="WHITE"
            onClick={() => {
              router("/signup");
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
}

export default Welcome;
