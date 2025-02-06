import instance from "../instance";
import { questionType } from "../types/questions";

//meetingID에 맞는 질문 받아오기
export const fetchQuestions = async (meetingId: string): Promise<questionType[]> => {
  const response = await instance.get(`/api/meetings/${meetingId}/questions`);

  return await response.data;
};
