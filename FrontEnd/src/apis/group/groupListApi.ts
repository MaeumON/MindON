// groupList axios

import instance from "../instance";

interface requestData {
  keyword: string;
  diseaseId: [1, 2, 3];
  isHost: boolean;
  startDate: Date;
  period: number;
  startTime: Date;
  endTime: Date;
  dayOfWeek: [1, 2, 3];
}

interface responseData {
  data: [
    {
      groupId: number;
      title: string;
      diseaseId: number;
      diseaseName: string;
      isPrivate: boolean;
      privatePassword: string;
      inviteCode: string;
      isHost: boolean;
      startDate: Date;
      period: number;
      meetingTime: number;
      dayOfWeek: number;
      minMembers: number;
      maxiMembers: number;
      totalMembers: number;
      groupStatus: number;
    },
  ];
}

const groupListApi = async (requsetdata: requestData): Promise<responseData> => {
  try {
    const result = await instance.post<responseData>("/api/groups/list", requsetdata);
    console.log("apis/auth:", result.data);
    return {
      accessToken: result.data.accessToken,
      data: result.data.data,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default groupListApi;
