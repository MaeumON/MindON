import authInstance from "../authinstance";

const deleteUserApi = async () => {
  try {
    const response = await authInstance.patch("/api/users/delete");
    return response.status; // 삭제 성공 여부만 반환
  } catch (error) {
    console.error("deleteUserApi error:", error);
    throw error;
  }
};

export default deleteUserApi;
