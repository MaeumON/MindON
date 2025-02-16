import { getReportReasonApi, ReportReason } from "@apis/auth/adminApi";
import { useEffect, useState } from "react";
import Button from "../common/Button";

interface ReportReasonModalProps {
  userId: string;
  closeModal: () => void;
}

const ReportReasonModal = ({ userId, closeModal }: ReportReasonModalProps) => {
  const [report, setReport] = useState<ReportReason[]>([]);

  useEffect(() => {
    getReportReasonApi(userId).then((res) => {
      setReport(res);
    });
  }, []);

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-black/50 font-suite">
      <div className="w-[85%] h-[600px] flex flex-col items-center justify-center bg-offWhite rounded-[12px]">
        <div className="w-[80%] h-full flex flex-col justify-start items-start gap-[10px]">
          <p className="w-full mt-[50px] font-bold text-18px text-center">신고 내역</p>
          <div className="w-full mt-[30px] text-center">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="max-w-[50px] bg-cardContent2 text-white">
                  <th className="border border-gray-300 px-4 py-2 text-center break-keep">신고 사유</th>
                  <th className="border border-gray-300 px-4 py-2 text-center break-keep">신고 내용</th>
                </tr>
              </thead>
              <tbody>
                {report.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 break-keep">{data.reasonName}</td>
                    <td className="border border-gray-300 px-4 py-2 break-keep whitespace-pre-wrap">{data.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[80%] mb-[50px] flex justify-between gap-[15px]">
          <Button text="닫기" type="GREEN" onClick={closeModal} className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default ReportReasonModal;
