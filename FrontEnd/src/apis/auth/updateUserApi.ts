import authInstance from "../authinstance";

export interface UpdateUserData {
  password?: string;
  phone?: string;
  diseaseId?: number;
}

export interface UserInfo {
  userId: string;
  userName: string;
  phone: string;
  diseaseId: number;
  diseaseName: string;
}

//회원정보 받아오는 함수수
export const getUserInfoApi = async (): Promise<UserInfo> => {
  try {
    const response = await authInstance.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
};

// updateUser 함수에서 Data를 매개변수로 전달받도록 수정
const updateUserApi = async (data: UpdateUserData): Promise<void> => {
  try {
    await authInstance.patch("/api/users/profile", data);
    console.log("회원 정보 수정 요청 성공");
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
};

export default updateUserApi;
