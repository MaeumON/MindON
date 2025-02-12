import authInstance from "../authinstance";

export interface UpdateUserData {
  password?: string;
  phone?: string;
  diseaseId?: number;
}

// updateUser 함수에서 Data를 매개변수로 전달받도록 수정
const updateUserApi = async (data: UpdateUserData): Promise<void> => {
  try {
    await authInstance.patch("/api/auth/updateUser", data);
    console.log("회원 정보 수정 요청 성공");
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
};

export default updateUserApi;
