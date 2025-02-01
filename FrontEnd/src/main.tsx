import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
/* 도커파일 테스트---------------
import { worker } from "./mocks/browser";
==========================*/

if (process.env.NODE_ENV === "development") {
  //worker.start().then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  //});
} else {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
