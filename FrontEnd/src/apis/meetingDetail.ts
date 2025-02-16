import authInstance from "./authinstance";

export interface ReviewType {
  meetingId: number;
  userId: string;
  emotionId: number;
  summation: string;
  cheeringMessage: string;
  speechAmount: number;
  date: string;
  period: number;
  progressWeeks: number;
  meetingWeek: number;
}
interface ReviewsResponse {
  emotionAvg: number;
  data: ReviewType[];
}

// 특정 그룹의 리뷰 목록 조회
export const fetchReviews = async (groupId: number): Promise<ReviewsResponse> => {
  const response = await authInstance.get(`/api/groups/${groupId}/reviews`);

  return await response.data;
};
