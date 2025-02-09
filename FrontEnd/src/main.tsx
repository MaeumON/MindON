import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { worker } from "./mocks/browser";

async function deferRender() {
  console.log("dev? ", import.meta.env.DEV);
  console.log("VITE_APP_API_URL", import.meta.env.VITE_APP_API_URL);
  //개발모드 확인
  if (!import.meta.env.DEV) {
    // 프로덕션 환경에서 서비스 워커 제거
    if ("serviceWorker" in navigator) {
      console.log("work");
      await navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    return;
  }

  await worker.start();
}

deferRender().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
