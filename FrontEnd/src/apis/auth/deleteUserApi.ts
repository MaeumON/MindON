import authInstance from "../authinstance";

const deleteUserApi = async () => {
  try {
    await authInstance.post("/api/users/delete");
  } catch (error) {
    console.error("deleteUserApi error:", error);
  }
};

export default deleteUserApi;
