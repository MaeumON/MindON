import authInstance from "./authinstance";

// 🔹 온도 정보를 가져오는 API 함수 추가
export const fetchTemperature = async () => {
  try {
    const response = await authInstance.get(`/api/users/temparature`);
    return response.data.temperature; // 🔹 온도 값만 반환
  } catch (error) {
    console.error("온도 데이터를 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
