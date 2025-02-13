import axios from "axios";
import useAuthStore from "@/stores/authStore";

const { VITE_APP_API_URL } = import.meta.env;

const authInstance = axios.create({
  baseURL: VITE_APP_API_URL, // 프로덕션 환경
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

// 요청 인터셉터 (Request Interceptor)
authInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    // instance 내부에 useAuthStore 훅 사용 금지이므로 getState()사용

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Authorization 헤더 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
authInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 (Unauthorized) 발생 && 원래 요청이 재시도된 게 아니라면 실행
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        // refresh 요청할 토큰 가져오기
        const { refreshToken } = useAuthStore.getState();

        // 백엔드에 refresh 요청
        const res = await axios.post(`${VITE_APP_API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.refreshToken;

          // 새 토큰 저장
          useAuthStore.getState().setAuth({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
          // 원래 요청에 새 accessToken 추가 후 재시도
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return authInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        useAuthStore.getState().logout(); // 상태 초기화 메서드
        window.location.href = "/login"; // 로그인 페이지로 이동
      }
    }

    return Promise.reject(error);
  }
);

export default authInstance;
