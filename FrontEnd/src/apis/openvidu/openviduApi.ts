import { AxiosError } from "axios";
import { createSessionResponse } from "@utils/openviduTypes";
import authInstance from "../authinstance";

const VIDEO_API_BASE = "/api/video";

export const createSession = async (sessionId: string): Promise<createSessionResponse> => {
  const response = await authInstance.post(VIDEO_API_BASE + "/sessions", { customSessionId: sessionId });

  return response.data;
};

// 새로 생성된 세션 아이디로 토큰 생성
export const createToken = async (sessionId: string): Promise<string> => {
  const response = await authInstance.post(VIDEO_API_BASE + "/sessions/" + sessionId + "/connections", {});

  return response.data;
};

//사용자 한 명 세션 나가기
export async function removeUser(requestData: { sessionName: string; token: string }) {
  try {
    console.log("requestData in api", requestData);
    await authInstance.post(VIDEO_API_BASE + "/remove-user", requestData);
    console.log("removeUser 성공");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("사용자 세션 나가기 오류");
    }
  }
}

//세션 완전 종료
export async function closeSession(sessionName: string) {
  try {
    await authInstance.delete(VIDEO_API_BASE + "/close-session", {
      data: { sessionName: sessionName },
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("세션 종료 오류");
    }
  }
}
