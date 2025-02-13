import instance from "../instance";

async function checkUserIdApi(userId: string) {
  const response = await instance.post(`/api/auth/check-id`, {
    userId: userId,
  });
  return response.data;
}

export default checkUserIdApi;
