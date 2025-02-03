// 로고를 만들긴 했으나... absolute 속성 때문인건지 그림과 나란히 배치가 안됨 ㅠㅠ!
// png도 함께 만들어두었으니 그거 사용해도 됨(하지만 화질은 컴포넌트가 더 좋음)

const Logo = () => {
  return (
    <div className="h-[46px] relative font-jamsilBold">
      <div className="left-[4.28px] top-[2px] absolute text-[#828282] text-[40px]">마음ON</div>
      <div className="left-0 top-0 absolute text-[#faf9f6] text-[40px]">마음ON</div>
    </div>
  );
};

export default Logo;
