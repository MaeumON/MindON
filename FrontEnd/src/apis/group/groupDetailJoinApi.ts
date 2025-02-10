// groupDetailJoin axios

import authInstance from "../authinstance";

interface IsJoinResponse {
  message?: string;
}

const groupDetailJoinApi = async (groupId: string): Promise<IsJoinResponse> => {
  try {
    const result = await authInstance.post<IsJoinResponse>(`/api/groups/${groupId}/members`);
    console.log("groupDetailJoinApi : ", result);
    return result.data;
  } catch (error) {
    console.error("groupDetail axios error:", error);
    throw error;
  }
};

export default groupDetailJoinApi;
