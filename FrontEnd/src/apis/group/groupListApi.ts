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

interface ResponseData {
  data: Group[]; // 그룹 목록이므로 배열 형태
}

const groupListApi = async (requestData: Partial<RequestData> = {}): Promise<ResponseData> => {
  try {
    const result = await authInstance.post<ResponseData>("/api/groups/list", requestData);
    console.log("apis/auth:", result.data);
    return result.data;
  } catch (error) {
    console.error("groupList axios error:", error);
    throw error;
  }
};

export default groupListApi;
