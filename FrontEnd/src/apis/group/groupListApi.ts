// groupList axios

// import axios from "axios";
import instance from "../instance";

interface requestData {
    headers { 
        accessToken:String
       }
      requestbody{
        keyword : String
        diseaseId : [1,2,3]
        isHost : Boolean
        startDate : Date
        period : Integer
        startTime : Date
        endTime : Date
        dayOfWeek : [1,2,3]
      }
}

interface Data {
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

const groupListApi = async (userId: string, password: string): Promise<Data> => {
  try {
    const result = await instance.post<Data>("/api/groups/list", { userId, password });
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
