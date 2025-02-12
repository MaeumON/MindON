import { create } from "zustand";
import { fetchQuestions } from "@/apis/openvidu/questionApi";
import { questionType } from "@apis/types/questions";

interface QuestionState {
  questions: questionType[];
  isMeetingStart: number;
  isQuestionStart: number;
  currentQuestionNumber: number;
  currentUser: number;
  currentUserId: string;
  currentQuestionId: number;
  currentQuestionText: string;
  currentBtnText: string;
  isSpeaking: boolean;
  remainingTime: number;
  totalAnswerPerQuestion: number;
}

interface QuestionActions {
  fetchQuestionsData: (meetingId: number) => Promise<void>;
  setIsMeetingStart: (isMeetingStart: number) => void;
  setIsQuestionStart: (isQuestionStart: number) => void;
  setCurrentQuestionNumber: (currentQuestionNumber: number) => void;
  setCurrentUser: (currentUser: number) => void;
  setCurrentUserId: (currentUserId: string) => void;
  setCurrentQuestionId: (currentQuestionId: number) => void;
  setCurrentQuestionText: (currentQuestionText: string) => void;
  setCurrentBtnText: (currentBtnText: string) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setRemainingTime: (remainingTime: number) => void;
  setTotalAnswerPerQuestion: (totalAnswerPerQuestion: number) => void;
  reset: () => void;
}

const initialState: QuestionState = {
  questions: [], //질문 목록
  isMeetingStart: 0, //0: 미팅 시작 전, 1: 미팅 중, 2: 미팅 종료
  isQuestionStart: 0, //0: 질문 시작 전, 1: 질문 중, 2: 질문 종료
  currentQuestionNumber: 0, //현재 질문 번호
  currentQuestionId: 0, //현재 질문 아이디
  currentQuestionText: "", //현재 질문 텍스트
  currentUser: 0, //현재 답변자 순서
  currentUserId: "", //현재 답변자 아이디
  currentBtnText: "", //현재 버튼 텍스트
  isSpeaking: false, //현재 발언 중인지 여부
  remainingTime: 0,
  totalAnswerPerQuestion: 0, //현재 질문의 총 답변자 수
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
  setCurrentUserId: (currentUserId) => set({ currentUserId }),
  setCurrentQuestionId: (currentQuestionId) => set({ currentQuestionId }),
  setCurrentQuestionText: (currentQuestionText) => set({ currentQuestionText }),
  setCurrentBtnText: (currentBtnText) => set({ currentBtnText }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setRemainingTime: (remainingTime) => set({ remainingTime }),
  setTotalAnswerPerQuestion: (totalAnswerPerQuestion) => set({ totalAnswerPerQuestion }),
  reset: () => set(initialState),
}));
