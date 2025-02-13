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

    if (response.data.message === "fail") {
      throw new Error("fail");
    }

    console.log("📌 모임 만들었따~!");
    return response.data;
  } catch (error: any) {
    console.error("모임만들기 api 에러:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
