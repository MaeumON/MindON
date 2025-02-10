// groupDetailLeave axios

import authInstance from "../authinstance";

const groupDetailLeaveApi = async (groupId: string): Promise<void> => {
  try {
    await authInstance.delete<void>(`/api/groups/${groupId}/members`);
    console.log("groupDetailLeaveApi : ", "모임 탈퇴 성공");
  } catch (error) {
    console.error("모임 탈퇴 실패", error);
    throw error;
  }
};

export default groupDetailLeaveApi;
