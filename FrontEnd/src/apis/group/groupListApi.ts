// groupListApi.ts

import authInstance from "../authinstance";
import { RequestData, ApiResponse } from "@utils/groups";

// interface ResponseData {
//   data: Group[]; // 그룹 목록이므로 배열 형태
// }

interface GroupStatusRequest {
  groupStatus?: string;
  keyword?: string;
}

const groupListApi = async (
  requestData: Partial<RequestData>,
  page: number = 0,
  size: number = 10,
  sort: string = "startDate,asc"
): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
    }).toString();

    const result = await authInstance.post<ApiResponse>(`/api/groups/list?${queryParams}`, requestData);

    // const result = await authInstance.post<Group[]>("/api/groups/list", payload);
    console.log("📌 전체 API 응답 without data:", result);
    // console.log("📌 전체 API 응답:", result.data);
    return result.data;
  } catch (error) {
    console.error("groupList axios error:", error);
    throw error;
  }
};

export default groupListApi;

export const groupStatusApi = async (
  { groupStatus, keyword }: GroupStatusRequest,
  page: number = 0,
  size: number = 10,
  sort: string = "startDate,asc"
): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
    }).toString();
    console.log("그룹상태:", groupStatus);
    console.log("쿼리파람스", queryParams);
    const result = await authInstance.post<ApiResponse>(`/api/groups/${groupStatus}/list?${queryParams}`, {
      keyword: keyword,
    });

    console.log("result data : ", result.data);
    return result.data;
  } catch (error) {
    console.error("마이페이지/마이데이터용 grouplist axios 오류 : ", error);
    throw error;
  }
};
