const GroupJoinModal = ({ isRegi }: { isRegi: boolean }) => {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(344px,100vw,412px)] h-screen flex items-center justify-center bg-black/50 z-10 ">
      <div className="w-[80%] h-[150px] py-[11px] px-[20px] flex justify-center items-center bg-offWhite rounded-[12px] font-jamsilRegular text-24px text-center">
        {isRegi && (
          <p>
            그룹 가입에
            <br />
            성공했습니다.
          </p>
        )}
        {!isRegi && (
          <p>
            그룹 가입이
            <br />
            취소되었습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupJoinModal;
