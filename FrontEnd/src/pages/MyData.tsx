import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import JypBear from "@/assets/images/jypbear.png";

function MyData() {
  return (
    <div>
      <Header title={"마음 리포트"} isicon={true} />
      <div className="HeadMsg flex justify-center p-10 gap-2">
        <div className="Msg flex flex-col justify-center whitespace-nowrap">
          <div className="text-22px font-suite font-semibold">오늘의 이하영님은</div>
          <div className="text-24px font-jamsilMedium">충분히 따뜻했나요?</div>
        </div>
        <img src={JypBear} alt="JypBear" className="sm:w-[100px] sm:h-[100px] w-[80px] h-[80px]" />{" "}
      </div>
      <div className="h-[50px]" />
      <Footer />
    </div>
  );
}

export default MyData;
