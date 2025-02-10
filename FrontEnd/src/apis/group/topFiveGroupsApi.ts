import { Group } from "@/utils/groups";
import authInstance from "../authinstance";

const topFiveGroupsApi = async (diseaseId: number): Promise<Group[]> => {
  try {
    const result = await authInstance.get<Group[]>(`/api/groups/${diseaseId}/list`);
    console.log("📌 전체 API 응답:", result);
    return result.data;
  } catch (error) {
    console.error("groupList axios error:", error);
    throw error;
  }
};

export default topFiveGroupsApi;
