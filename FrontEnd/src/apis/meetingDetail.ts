import instance from "./instance";

export interface ReviewType {
  meetingId: number;
  userId: string;
  emotion: number;
  summation: string;
  cheeringMessage: string;
  speechAmount: number;
  date: string;
  period: number;
  progressWeeks: number;
}
interface ReviewsResponse {
  emotionAvg: number;
  data: ReviewType[];
}

// 특정 그룹의 리뷰 목록 조회
export const fetchReviews = async (groupId: string): Promise<ReviewsResponse> => {
  const response = await instance.get(`/api/groups/${groupId}/reviews`);

  return await response.data;
};
