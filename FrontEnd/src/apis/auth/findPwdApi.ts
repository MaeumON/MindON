// findPwd axios

// import axios from "axios";
import instance from "../instance";

interface findPwdRequestType {
  status: boolean;
}

//회원여부 확인 API
const findPwdApi = async (userId: string, phone: string): Promise<findPwdRequestType> => {
  try {
    const result = await instance.post<findPwdRequestType>("/api/auth/password", { userId, phone });
    console.log("apis/auth:", result.data);
    return result.data;
  } catch (error) {
    console.error("Check user error:", error);
    throw error;
  }
};

export default findPwdApi;
