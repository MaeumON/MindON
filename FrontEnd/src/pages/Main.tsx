function Main() {
  let userName = "이하영";
  return (
    <div>
      <section className="bg-yellow100 card-title flex ">
        <section className="flex flex-col justify-center gap-[10px] items-stretch">
          <div className="font-jamsilMedium text-[28px] text-cardTitle">안녕하세요, {userName}님</div>
          <div className="font-jamsilRegular text-[24px] text-cardTitle">오늘도 온이와 함께</div>
          <div className="font-jamsilRegular text-[24px]">마음을 ON 해볼까요?</div>
        </section>
      </section>
    </div>
  );
}

export default Main;
