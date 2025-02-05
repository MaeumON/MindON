import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

function MyData() {
  return (
    <div>
      <Header title={"마음 리포트"} isicon={true} />
      <div>mydata</div>
      <div className="h-[50px]" />
      <Footer />
    </div>
  );
}

export default MyData;
