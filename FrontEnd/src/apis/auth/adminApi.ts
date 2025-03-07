import authInstance from "../authinstance";

export interface ReportedUser {
  userId: string;
  userName: string;
}

export interface ReportReason {
  reasonId: number;
  reasonName: string;
  reason: string;
}

export async function getReportedUserApi(): Promise<ReportedUser[]> {
  const response = await authInstance.get(`/api/users/reportlist`);
  return response.data;
}

export async function unblockUserApi(userId: string) {
  const response = await authInstance.put(`/api/users/reset`, {
    userId: userId,
  });
  return response.data;
}

export async function getReportReasonApi(userId: string): Promise<ReportReason[]> {
  const response = await authInstance.get(`/api/users/${userId}/reasonlist`);
  return response.data;
}
