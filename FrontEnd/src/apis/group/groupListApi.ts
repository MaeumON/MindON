// groupList axios
import authInstance from "../authinstance";

export interface RequestData {
  keyword?: string;
  diseaseId: number[];
  isHost: boolean | null; // 진행자 여부 (true, false, null)
  startDate: Date; // 날짜 (YYYY-MM-DD 00-00-00)
  period: number; // 기간 (1~8주)
  startTime: Date; // 시작 시간 (HH)
  endTime: Date; // 종료 시간 (HH)
  dayOfWeek: number[]; // 요일 (1~7)
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
    //pagination 처리 후 추가
    // const payload = { ...requestData, page };
    const result = await authInstance.post<Group[]>("/api/groups/list", requestData);
    // const result = await authInstance.post<Group[]>("/api/groups/list", payload);
    console.log("📌 전체 API 응답 without data:", result);
    console.log("📌 전체 API 응답:", result.data);
    return result.data;
  } catch (error) {
    console.error("groupList axios error:", error);
    throw error;
  }
};

export default groupListApi;
