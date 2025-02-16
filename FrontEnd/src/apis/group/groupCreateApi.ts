import authInstance from "../authinstance";
import { CreateRoomReqestType } from "@utils/groups";

export const createGroupApi = async (requestData: CreateRoomReqestType): Promise<string> => {
  try {
    const response = await authInstance.post("/api/groups", requestData);

    if (response.status === 201) {
      console.log("📌 모임 생성 성공:", response.data);

      // 서버에서 반환한 메시지 처리
      if (response.data.message === "success") {
        return "success"; // 성공 메시지 반환
      } else if (response.data.message === "fail") {
        return "fail"; // 실패 메시지 반환
      } else {
        console.error("서버 응답 오류:", response.data);
        throw new Error(response.data.message || "모임 생성 중 서버 오류가 발생했습니다.");
      }
    }
  } catch (error: any) {
    console.error("모임 생성 api 에러:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // 서버에서 반환한 오류 메시지와 코드 출력
    if (error.response?.data?.message) {
      alert(`오류: ${error.response.data.message}`);
      alert(`코드: ${error.response.data.code}`); // 오류 코드도 알림으로 출력
    } else {
      alert("모임 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
    throw error;
  }

  return ""; // 기본값 반환
};
