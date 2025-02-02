// findId axios

// import axios from "axios";
import instance from "../instance";

interface Data {
  data: {
    userId: string;
  };
}

const findId = async (userName: string, email: string): Promise<Data[]> => {
  try {
    const result = await instance.post<Data[]>("/api/auth/userid", { userName, email });
    console.log("apis/auth:", result.data);
    return result.data;
  } catch (error) {
    console.error("FindId error:", error);
    throw error;
  }
};

export default findId;
