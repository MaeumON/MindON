// login axios

import instance from "../instance";

interface Data {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  diseaseId: number;
  diseaseName: string;
  isAdmin: boolean;
}

const loginApi = async (userId: string, password: string): Promise<Data> => {
  try {
    const result = await instance.post<Data>("/api/auth/login", { userId, password });
    console.log("apis/auth:", result.data);
    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      userId: result.data.userId,
      userName: result.data.userName,
      diseaseId: result.data.diseaseId,
      diseaseName: result.data.diseaseName,
      isAdmin: result.data.isAdmin,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default loginApi;
