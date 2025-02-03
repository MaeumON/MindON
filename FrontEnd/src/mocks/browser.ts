import { setupWorker } from "msw/browser";
import handlers from "./handlers";

export const worker = setupWorker(...handlers);

// MSW 실행 중복 방지
if (typeof window !== "undefined") {
  worker.start({
    onUnhandledRequest: "bypass", // 정적 파일 요청 무시
  });
}
