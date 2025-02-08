// groupList axios

import { RequestData, Group } from "./groupListApi";
import authInstance from "../authinstance";

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
