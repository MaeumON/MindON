// groupDetail axios

import authInstance from "../authinstance";
import { GroupDetail } from "@/utils/groups";

const groupDetailApi = async (groupId: string): Promise<GroupDetail> => {
  try {
    const result = await authInstance.get<GroupDetail>(`/api/groups/${groupId}`);
    console.log("groupDetailApi : ", result);
    return result.data;
  } catch (error) {
    console.error("groupDetail axios error:", error);
    throw error;
  }
};

export default groupDetailApi;
