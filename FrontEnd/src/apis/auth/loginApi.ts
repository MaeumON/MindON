// login axios

// import axios from "axios";
import instance from "../instance";

interface Data {
  accessToken: string;
  refreshToken: string;
  data: {
    userId: string;
    userName: string;
    diseaseId: number;
    diseaseName: string;
  };
}

const loginApi = async (userId: string, password: string): Promise<Data> => {
  try {
    const result = await instance.post<Data>("/api/auth/login", { userId, password });
    console.log("apis/auth:", result.data);
    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      data: result.data.data,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default loginApi;
