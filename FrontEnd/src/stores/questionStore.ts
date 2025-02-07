import { create } from "zustand";
import { fetchQuestions } from "@/apis/openvidu/questionApi";
import { questionType } from "@apis/types/questions";

interface QuestionState {
  questions: questionType[];
  isMeetingStart: number;
  isQuestionStart: number;
  currentQuestionNumber: number;
  currentUser: number;
  currentQuestionText: string;
  currentBtnText: string;
}

interface QuestionActions {
  fetchQuestionsData: (meetingId: string) => Promise<void>;
  setIsMeetingStart: (isMeetingStart: number) => void;
  setIsQuestionStart: (isQuestionStart: number) => void;
  setCurrentQuestionNumber: (currentQuestionNumber: number) => void;
  setCurrentUser: (currentUser: number) => void;
  setCurrentQuestionText: (currentQuestionText: string) => void;
  setCurrentBtnText: (currentBtnText: string) => void;
}

const initialState: QuestionState = {
  questions: [], //질문 목록
  isMeetingStart: 0, //0: 미팅 시작 전, 1: 미팅 중, 2: 미팅 종료
  isQuestionStart: 0, //0: 질문 시작 전, 1: 질문 중, 2: 질문 종료
  currentQuestionNumber: 0, //현재 질문 번호
  currentUser: 0, //현재 답변자 번호
  currentQuestionText: "", //현재 질문 텍스트
  currentBtnText: "", //현재 버튼 텍스트
};

export const useQuestionStore = create<QuestionState & QuestionActions>()((set) => ({
  ...initialState,
  fetchQuestionsData: async (meetingId) => {
    try {
      const response = await fetchQuestions(meetingId);
      set({ questions: response });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  },
  setIsMeetingStart: (isMeetingStart) => set({ isMeetingStart }),
  setIsQuestionStart: (isQuestionStart) => set({ isQuestionStart }),
  setCurrentQuestionNumber: (currentQuestionNumber) => set({ currentQuestionNumber }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setCurrentQuestionText: (currentQuestionText) => set({ currentQuestionText }),
  setCurrentBtnText: (currentBtnText) => set({ currentBtnText }),
}));
