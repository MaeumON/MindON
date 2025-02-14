import authInstance from "../authinstance";
import { questionType } from "../types/questions";

// 미팅 ID 받아오기
export const fetchMeetingId = async (groupId: string): Promise<number> => {
  const response = await authInstance.get(`/api/meetings/ongoing/${groupId}`);
  return response.data.meetingId;
};

//meetingID에 맞는 질문 받아오기
export const fetchQuestions = async (meetingId: number): Promise<questionType[]> => {
  console.log("fetch Questions meetingId", meetingId);
  const response = await authInstance.get(`/api/meetings/${meetingId}/questions`);
  console.log("response", response);
  return await response.data.data;
};

interface QuestionSpeakingOrderType {
  no: number;
  userId: string;
  userName: string;
}

//질문 발언 순서 받아오기
export const fetchQuestionSpeakingOrder = async ({
  groupId,
}: {
  groupId: string;
}): Promise<QuestionSpeakingOrderType[]> => {
  const response = await authInstance.get(`/api/users/${groupId}/list`);

  return await response.data.data;
};
