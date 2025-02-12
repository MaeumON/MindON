import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const useAuthStore = create<StoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      userId: "",
      userName: "",
      diseaseId: 1, // 초기값 통일
      diseaseName: "",

      // 로그인 정보 저장 (기존 상태를 유지하면서 일부 값만 변경)
      setAuth: (authData: Partial<StoreState>) => set((state) => ({ ...state, ...authData })),

      // 로그아웃 시 초기 상태로 리셋
      logout: () =>
        set({
          accessToken: "",
          refreshToken: "",
          userId: "",
          userName: "",
          diseaseId: 1, // 초기값과 동일하게 유지
          diseaseName: "",
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
