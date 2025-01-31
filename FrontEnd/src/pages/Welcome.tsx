import Button from "@/components/common/Button";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-yellow100">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        마음ON <span className="text-4xl">🐻‍❄️</span>
      </h1>
      <div className="mt-6 w-[80%] flex flex-col items-center gap-6  align-self-stretch">
        <Button text={"로그인"} type="Green" />
        <Button text={"회원가입"} type="White" />
      </div>
    </div>
  );
}

export default Welcome;
