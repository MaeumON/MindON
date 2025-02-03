// findPwd axios

// import axios from "axios";
import instance from "../instance";

interface Data {
  data: {
    state: boolean;
  };
}

const findPwdApi = async (userId: string, email: string): Promise<Data[]> => {
  try {
    const result = await instance.post<Data[]>("/api/auth/password", { userId, email });
    console.log("apis/auth:", result.data);
    return result.data;
  } catch (error) {
    console.error("FindId error:", error);
    throw error;
  }
};

export default findPwdApi;
