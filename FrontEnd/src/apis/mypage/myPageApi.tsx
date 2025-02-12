// findId axios

import authInstance from "../authinstance";

interface MyPageData {
  preGroup: number;
  startingGroup: number;
  endGroup: number;
}

const myPageApi = async (): Promise<MyPageData> => {
  try {
    const result = await authInstance.get<MyPageData>("/api/groups/count");
    console.log("apis/mypage:", result.data);
    return result.data;
  } catch (error) {
    console.error("myPageApi error:", error);
    throw error;
  }
};

export default myPageApi;
