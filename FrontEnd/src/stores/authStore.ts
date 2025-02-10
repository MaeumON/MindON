import { create } from "zustand";

//Login
interface StoreState {
  accessToken: string;
  refreshToken: string;
  data: {
    userId: string;
    userName: string;
    diseaseId: number;
    diseaseName: string;
  };

  setAuth: (accessToken: string, refreshToken: string, data: StoreState["data"]) => void;
  logout: () => void;
}

const useAuthStore = create<StoreState>((set) => ({
  accessToken: "",
  refreshToken: "",
  data: {
    userId: "",
    userName: "",
    diseaseId: 1,
    diseaseName: "",
  },

  // 로그인 정보 저장
  setAuth: (accessToken, refreshToken, data) => set({ accessToken, refreshToken, data }),
  // 로그아웃하면 초기상태로 리셋
  logout: () =>
    set({ accessToken: "", refreshToken: "", data: { userId: "", userName: "", diseaseId: 0, diseaseName: "" } }),
}));

export default useAuthStore;
