import { http, HttpResponse } from "msw";
import { GROUPS } from "../data/GROUPS";
import { QUESTIONS } from "../data/QUESTIONS";
import { LOGINUSER } from "../data/LOGINUSER";
import { FINDID } from "../data/FINDID";
const { VITE_API_BASE } = import.meta.env;

const handlers = [
  //그룹 목록 조회
  http.get(VITE_API_BASE + "/api/groups/list", () => {
    return HttpResponse.json(GROUPS);
  }),

  // 질문 받아오기
  http.get(VITE_API_BASE + "/api/meetings/:meetingId/questions", (req) => {
    const { meetingId } = req.params; // meetingId 파라미터 접근

    //쓰지 않는 변수 처리용
    console.log(meetingId);

    return HttpResponse.json(QUESTIONS);
  }),

  // User Login 정보
  http.post(VITE_API_BASE + "/api/auth/login", () => {
    return HttpResponse.json(LOGINUSER);
  }),

  // FindId 정보
  http.post(VITE_API_BASE + "/api/auth/userid", () => {
    return HttpResponse.json(FINDID);
  }),

  //SignUp 정보
  http.post(VITE_API_BASE + "/api/auth/signup", () => {
    new HttpResponse("Create", {
      status: 201,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }),
];

export default handlers;
