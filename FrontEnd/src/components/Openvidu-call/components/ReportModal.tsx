import { reportRequestApi } from "@/apis/openvidu/reportingApi";
import Button from "@/components/common/Button";
import { useState } from "react";

const reasonData = [
  { id: 1, name: "부적절한 발언" },
  { id: 2, name: "스팸" },
  { id: 3, name: "부적절한 행동" },
  { id: 4, name: "허위 신고" },
  { id: 5, name: "기타" },
];

interface ReportModalProps {
  setIsReportModalOpen: (isOpen: boolean) => void;
  reportedUserId: string;
  reportedUserName: string;
  meetingId: number;
}

const ReportModal = ({ setIsReportModalOpen, reportedUserId, reportedUserName, meetingId }: ReportModalProps) => {
  const [reasonId, setReasonId] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  function handleCloseModal() {
    setIsReportModalOpen(false);
  }

  function handleReportUser() {
    reportRequestApi({ reportedUserId, reasonId, reason, meetingId })
      .then(() => {
        alert("신고에 성공했습니다.");
        handleCloseModal();
      })
      .catch((error) => {
        console.log(error);
        alert("신고에 실패했습니다. 나중에 다시 시도해주세요.");
      });
  }

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[85%] h-[600px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
        <p className="font-jamsilRegular text-24px text-black text-center">
          {reportedUserName}님을
          <br />
          신고하시겠습니까?
        </p>
        <div className="w-[80%] mt-[20px] flex flex-col justify-center items-start gap-[10px]">
          <p className="w-full font-bold text-18px">신고 유형</p>
          <select
            className="w-full px-[15px] py-[15px] border border-cardContent2 rounded-[12px]"
            name="reportReason"
            onChange={(e) => setReasonId(Number(e.target.value))}
          >
            <option value="">신고 사유를 선택해주세요</option>
            {reasonData.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-[80%] mt-[10px] flex flex-col justify-center items-start gap-[10px]">
          <p className="w-full font-bold text-18px">신고 내용</p>
          <textarea
            className="w-full h-[150px] px-[15px] py-[15px] border border-cardContent2 resize-none rounded-[12px]"
            name=""
            id=""
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <div className="w-[80%] mt-[20px] flex justify-between gap-[15px]">
          <Button text="취소하기" type="GRAY" onClick={handleCloseModal} className="text-white" />
          <Button text="신고하기" type="GREEN" onClick={handleReportUser} />
        </div>
      </div>
    </section>
  );
};

export default ReportModal;
