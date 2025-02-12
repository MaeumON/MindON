import authInstance from "../authinstance";

export async function checkGroupPwd({ groupId, password }: { groupId: number; password: string }) {
  const response = await authInstance.post(`api/groups/password`, {
    groupId: groupId,
    privatePassword: password,
  });
  return response.data;
}
