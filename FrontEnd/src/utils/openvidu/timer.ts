import { useQuestionStore } from "@/stores/questionStore";

let timerInterval: number | null = null;

export function startInitialTimer() {
  const store = useQuestionStore.getState();
  const { setRemainingTime } = store;

  // 초기 시간 설정 (5초)
  let timeLeft = 5;
  setRemainingTime(timeLeft);

  // 이전 타이머가 있다면 제거
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  return new Promise<void>((resolve) => {
    // 1초마다 타이머 업데이트
    timerInterval = window.setInterval(() => {
      timeLeft -= 1;
      setRemainingTime(timeLeft);

      // 시간이 다 되면 타이머 종료
      if (timeLeft <= 0) {
        if (timerInterval !== null) {
          clearInterval(timerInterval);
        }
        timerInterval = null;
        resolve();
      }
    }, 1000);
  });
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
