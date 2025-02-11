import { AxiosError } from "axios";
import authInstance from "../authinstance";

//모임 후 감정 기록
export async function saveEmotion(meetingId: number, emotionId: number) {
  try {
    await authInstance.post(`/api/userreview/${meetingId}/emotions`, {
      emotionId: emotionId,
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("감정 기록 오류");
    }
  }
}
