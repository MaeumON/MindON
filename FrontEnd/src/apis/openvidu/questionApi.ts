import { ParticipantType } from "@utils/openviduTypes";
import instance from "../instance";
import { questionType } from "../types/questions";

//meetingID에 맞는 질문 받아오기
export const fetchQuestions = async (meetingId: string): Promise<questionType[]> => {
  const response = await instance.get(`/api/meetings/${meetingId}/questions`);

  console.log("response", response);

  return await response.data;
};

interface QuestionSpeakingOrderType {
  no: number;
  userId: string;
  userName: string;
}

//질문 발언 순서 받아오기
export const fetchQuestionSpeakingOrder = async ({
  groupId,
  participants,
}: {
  groupId: string;
  participants: ParticipantType[];
}): Promise<QuestionSpeakingOrderType[]> => {
  const response = await instance.post(`/api/users/${groupId}/list`, {
    participants,
  });

  return await response.data;
};
