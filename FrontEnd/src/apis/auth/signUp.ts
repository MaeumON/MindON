// login axios

// import axios from "axios";
import instance from "../instance";

interface SignupData {
  userId: string;
  email: string;
  userName: string;
  password: string;
  phone: string;
  diseaseId: number;
}

// signup 함수에서 Data를 매개변수로 전달받도록 수정
const signup = async (data: SignupData): Promise<void> => {
  try {
    await instance.post("/api/auth/signup", data);
    console.log("회원가입 요청 성공");
  } catch (error) {
    console.error("signup error:", error);
    throw error;
  }
};

export default signup;
