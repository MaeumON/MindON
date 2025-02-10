import { AxiosError } from "axios";
import instance from "../instance";
import { createSessionResponse } from "@utils/openviduTypes";

// 세션아이디 (그룹아이디)로 새로우 세션 생성
// const createSession = async (sessionId: string): Promise<{ createdSessionId: string; isHost: boolean }> => {
//   const response = await openviduInstance.post(
//     "sessions",
//     { customSessionId: sessionId },
//     { headers: { "Content-Type": "application/json" } }
//   );

//   console.log("createSession", response.data);

//   return response.data;
// };

const VIDEO_API_BASE = "/api/video";

export const createSession = async (sessionId: string): Promise<createSessionResponse> => {
  const response = await instance.post(VIDEO_API_BASE + "/sessions", { customSessionId: sessionId });

  return response.data;
};

// 새로 생성된 세션 아이디로 토큰 생성
export const createToken = async (sessionId: string): Promise<string> => {
  const response = await instance.post(VIDEO_API_BASE + "/sessions/" + sessionId + "/connections", {});

  return response.data;
};

//사용자 한 명 세션 나가기
export async function removeUser({ sessionName, token }: { sessionName: string; token: string }) {
  try {
    await instance.post(VIDEO_API_BASE + "/remove-user", {
      sessionName: sessionName,
      token: token,
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("사용자 세션 나가기 오류");
    }
  }
}

//세션 완전 종료
export async function closeSession(sessionName: string) {
  try {
    await instance.delete(VIDEO_API_BASE + "/close-session", {
      data: { sessionName: sessionName },
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("세션 종료 오류");
    }
  }
}
