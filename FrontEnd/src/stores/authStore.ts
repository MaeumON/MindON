import { create } from "zustand";

//Login
interface StoreState {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  diseaseId: number;
  diseaseName: string;

  setAuth: (authData: Partial<StoreState>) => void;
  logout: () => void;
}

const useAuthStore = create<StoreState>((set) => ({
  accessToken: "",
  refreshToken: "",
  userId: "",
  userName: "",
  diseaseId: 1,
  diseaseName: "",

  // 로그인 정보 저장
  setAuth: (authData: Partial<StoreState>) => set(authData),

  // 로그아웃하면 초기상태로 리셋
  logout: () => set({ accessToken: "", refreshToken: "", userId: "", userName: "", diseaseId: 0, diseaseName: "" }),
}));

export default useAuthStore;
