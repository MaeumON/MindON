// groupList axios
import authInstance from "../authinstance";
import { RequestData, Group } from "@utils/groups";

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

export const groupStatusApi = async (groupStatus: number): Promise<Group[]> => {
  try {
    const result = await authInstance.post<Group[]>(`/api/groups/${groupStatus}/list`);
    return result.data;
  } catch (error) {
    console.error("마이페이지/마이데이터용 grouplist axios 오류 : ", error);
    throw error;
  }
};
