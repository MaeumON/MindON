// groupList axios

import authInstance from "../authinstance";

export interface RequestData {
  keyword: string;
  diseaseId: number;
  isHost: boolean;
  startDate: Date;
  period: number;
  startTime: Date;
  endTime: Date;
  dayOfWeek: number;
}

export interface Group {
  groupId: number;
  title: string;
  diseaseId: number;
  diseaseName: string;
  isPrivate: boolean;
  privatePassword?: string;
  inviteCode: string;
  isHost: boolean;
  startDate: Date;
  period: number;
  meetingTime: number;
  dayOfWeek: number;
  minMembers: number;
  maxiMembers: number;
  totalMembers: number;
  groupStatus: number;
}

// interface ResponseData {
//   data: Group[]; // 그룹 목록이므로 배열 형태
// }

const groupListApi = async (requestData: Partial<RequestData> = {}): Promise<Group[]> => {
  try {
    const result = await authInstance.post<Group[]>("/api/groups/list", requestData);
    console.log("📌 전체 API 응답:", result); // ✅ 전체 응답 확인
    console.log("📌 Apis 응답 데이터(result.data):", result.data); // ✅ result.data만 확인
    return result.data;
  } catch (error) {
    console.error("groupList axios error:", error);
    throw error;
  }
};

export default groupListApi;
