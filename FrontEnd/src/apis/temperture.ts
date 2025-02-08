import instance from "./instance";

const { VITE_APP_API_URL } = import.meta.env;

// 🔹 온도 정보를 가져오는 API 함수 추가
export const fetchTemperature = async () => {
  try {
    const response = await instance.get(`${VITE_APP_API_URL}/api/users/temparature`);
    return response.data.temperture; // 🔹 온도 값만 반환
  } catch (error) {
    console.error("온도 데이터를 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
