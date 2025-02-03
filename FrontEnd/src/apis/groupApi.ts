import instance from "./instance";
import { groupType } from "./types/groups";

export const fetchGroups = async (): Promise<groupType[]> => {
  try {
    const response = await instance.get("/api/groups/list");

    // API 응답 구조 확인
    console.log("API 응답:", response);

    // // 응답이 예상과 다를 경우 예외 처리
    // if (!response.data || typeof response.data !== "object" || !("data" in response.data)) {
    //   console.error("Invalid API response format:", response);
    //   return [];
    // }

    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
};
