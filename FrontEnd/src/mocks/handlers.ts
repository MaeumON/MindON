import { http, HttpResponse } from "msw";
import { GROUPS } from "../data/GROUPS";
import { QUESTIONS } from "../data/QUESTIONS";
import { LOGINUSER } from "../data/LOGINUSER";
import { FINDID } from "../data/FINDID";
import { FINDPWD } from "../data/FINDPWD";

const { VITE_APP_API_URL } = import.meta.env;

const handlers = [
  //그룹 목록 조회
  http.get(VITE_APP_API_URL + "/api/groups/list", () => {
    return HttpResponse.json(GROUPS);
  }),

  // 질문 받아오기
  http.get(VITE_APP_API_URL + "/api/meetings/:meetingId/questions", (req) => {
    const { meetingId } = req.params; // meetingId 파라미터 접근

    //쓰지 않는 변수 처리용
    console.log(meetingId);

    return HttpResponse.json(QUESTIONS);
  }),

  // User Login 정보
  http.post(VITE_APP_API_URL + "/api/auth/login", () => {
    return HttpResponse.json(LOGINUSER);
  }),

  // FindId 정보
  http.post(VITE_APP_API_URL + "/api/auth/userid", () => {
    return HttpResponse.json(FINDID);
  }),

  // FindPwd 정보
  http.post(VITE_APP_API_URL + "/api/auth/password", () => {
    return HttpResponse.json(FINDPWD);
  }),

  //SignUp 정보
  //성공함함
  // http.post(VITE_APP_API_URL + "/api/auth/signup", () => {
  //   new HttpResponse("Create", {
  //     status: 201,
  //     headers: {
  //       "Content-Type": "text/plain",
  //     },
  //   });
  // }),
];

export default handlers;
