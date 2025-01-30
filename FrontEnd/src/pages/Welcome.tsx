import Button from "@/components/common/Button";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center w-[412px] h-[1024px] bg-yellow100">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        마음ON <span className="text-4xl">🐻‍❄️</span>
      </h1>
      <div className="mt-6 w-full flex flex-col items-center gap-6  align-self-stretch">
        <Button text={"로그인"} type="DEFAULT" className="flex-1 h-12 bg-green-500 text-white rounded-lg" />
        <Button
          text={"회원가입"}
          type="White"
          className="w-full h-12 bg-white text-black rounded-lg border border-gray-300"
        />
      </div>
    </div>
  );
}

export default Welcome;
