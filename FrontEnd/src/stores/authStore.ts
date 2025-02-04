import { create } from "zustand";

//Login
interface StoreState {
  accessToken: string;
  data: {
    userId: string;
    userName: string;
    diseaseId: number;
    diseaseName: string;
  };

  setAuth: (accessToken: string, data: StoreState["data"]) => void;
  logout: () => void;
}

const useAuthStore = create<StoreState>((set) => ({
  accessToken: "",
  data: {
    userId: "",
    userName: "",
    diseaseId: 0,
    diseaseName: "",
  },

  // 로그인 정보 저장
  setAuth: (accessToken, data) => set({ accessToken, data }),
  // 로그아웃하면 초기상태로 리셋
  logout: () => set({ accessToken: "", data: { userId: "", userName: "", diseaseId: 0, diseaseName: "" } }),
}));

export default useAuthStore;
