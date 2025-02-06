// 비밀번호 찾기 -> 비밀번호 수정 axios

// import axios from "axios";
import instance from "../instance";

interface ChangePwdData {
  userId: string;
  password: string;
}

// signup 함수에서 Data를 매개변수로 전달받도록 수정
const changePwdApi = async (data: ChangePwdData): Promise<void> => {
  try {
    await instance.post("/api/auth/password/reset", data);
    console.log("비밀번호 수정 성공");
  } catch (error) {
    console.error("signup error:", error);
    throw error;
  }
};

export default changePwdApi;
