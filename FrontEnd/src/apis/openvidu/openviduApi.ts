import openviduInstance from "@apis/openviduInstance";

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

const createSession = async (sessionId: string): Promise<string> => {
  const response = await openviduInstance.post(
    "sessions",
    { customSessionId: sessionId },
    { headers: { "Content-Type": "application/json" } }
  );

  console.log("createSession", response.data);

  return response.data;
};

// 새로 생성된 세션 아이디로 토큰 생성
const createToken = async (sessionId: string): Promise<string> => {
  const response = await openviduInstance.post("sessions/" + sessionId + "/connections", {});

  return response.data;
};

export const getToken = async (sessionId: string): Promise<string> => {
  const createdSessionId = await createSession(sessionId);
  const generatedToken = await createToken(createdSessionId);
  console.log("generatedToken", generatedToken);

  return generatedToken;
};
