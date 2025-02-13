import authInstance from "../authinstance";
import useAuthStore from "@stores/authStore";
import { useNavigate } from "react-router-dom";

const useLogoutApi = () => {
  const router = useNavigate();
  const { logout } = useAuthStore(); // logout 함수 가져오기

  const logoutApi = async () => {
    try {
      await authInstance.post("/api/auth/logout");

      logout(); // 상태 초기화
      router("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("logoutApi error:", error);
    }
  };

  return logoutApi;
};

export default useLogoutApi;
