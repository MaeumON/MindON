interface GroupMessageProps {
  groupStatus: number;
}
function GroupMessage({ groupStatus }: GroupMessageProps) {
  return (
    <div className="flex text-cardLongContent text-base font-medium leading-tight px-5 py-3 bg-yellow100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl justify-center items-center gap-2.5 ">
      {groupStatus === 0 && (
        <p>
          두근두근 설레는
          <br /> 모임이 곧 시작됩니다
        </p>
      )}
      {groupStatus === 1 && (
        <p>
          따뜻한 사람들과 함께
          <br />
          마음의 온기를 나누세요
        </p>
      )}
      {groupStatus === 2 && (
        <p>
          봄처럼 따뜻한 마음🌸
          <br /> 다음 모임을 찾아볼까요?
        </p>
      )}
    </div>
  );
}

export default GroupMessage;
