import Header from "@/components/Layout/Header";

function MyDataDetail() {
  return (
    <div>
      <Header title="마이데이터" isicon={true} />
      <div className="bg-white">
        <div>
          치매환자 가족모임<span>에 참여하셨군요.</span>
        </div>
        <div>이하영님의 기분은 훌륭함 </div>
      </div>
    </div>
  );
}

export default MyDataDetail;
