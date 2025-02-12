import { ReportRequestType } from "@/utils/reportRequestType";
import authInstance from "../authinstance";

export async function reportRequestApi({ reportedUserId, reasonId, reason, meetingId }: ReportRequestType) {
  const response = await authInstance.post(`/api/users/reports`, {
    reportedUserId: reportedUserId,
    reasonId: reasonId,
    reason: reason,
    meetingId: meetingId,
  });
  return response.data;
}
