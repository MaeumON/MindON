import authInstance from "./authinstance";
import { groupType } from "./types/groups";

export const fetchTopGroups = async (diseaseId: number): Promise<groupType[]> => {
  try {
    const response = await authInstance.get(`/api/groups/${diseaseId}/new`);

    // API 응답 구조 확인
    console.log("API 응답:", response);

    return response.data;
  } catch (error) {
    console.error("top5 가져오는데 실패함:", error);
    return [];
  }
};
