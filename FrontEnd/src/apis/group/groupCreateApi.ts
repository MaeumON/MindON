// import authInstance from "../authinstance";
// import { CreateRoomReqestType } from "@utils/groups";

// export const createGroupApi = async (requestData: CreateRoomReqestType): Promise<void> => {
//   try {
//     // Log the request data for debugging
//     console.log("Creating group with data:", JSON.stringify(requestData, null, 2));

//     const response = await authInstance.post("/api/groups", requestData);

//     if (response.status === 201 || response.status === 200) {
//       console.log("📌 모임 생성 성공:", response.data);
//       return response.data;
//     }
//   } catch (error: any) {
//     console.error("모임만들기 api 에러 상세:", {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message,
//     });

//     // Throw a more specific error
//     if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     } else {
//       throw new Error("모임 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
//     }
//   }
// };

import authInstance from "../authinstance";
import { CreateRoomReqestType } from "@utils/groups";

export const createGroupApi = async (requestData: CreateRoomReqestType): Promise<void> => {
  try {
    const response = await authInstance.post("/api/groups", requestData);

    if (response.status === 201) {
      console.log("📌 모임 생성 성공:", response.data);
      // 성공 시 메시지 확인 후 알림
      if (response.data.message === "success") {
        alert("모임이 성공적으로 생성되었습니다.");
      } else if (response.data.message === "fail") {
        alert("해당 시간에 이미 예정된 모임이 존재합니다.");
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
};
