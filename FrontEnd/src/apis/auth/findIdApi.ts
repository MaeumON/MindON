// findId axios

import instance from "../instance";

interface findUserIdType {
  userId: string;
}

const findIdApi = async (userName: string, phone: string): Promise<findUserIdType> => {
  try {
    const result = await instance.post<findUserIdType>("/api/auth/userid", { userName, phone });
    console.log("아이디 찾기: ", result.data);
    return result.data;
  } catch (error) {
    console.error("FindIdApi error:", error);
    throw error;
  }
};

export default findIdApi;
