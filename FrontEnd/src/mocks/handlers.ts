import { http, HttpResponse } from "msw";
import { GROUPS } from "../data/GROUPS";
import { QUESTIONS } from "../data/QUESTIONS";
const { VITE_API_BASE } = import.meta.env;

const handlers = [
  //그룹 목록 조회
  http.get(VITE_API_BASE + "/api/groups/list", () => {
    return HttpResponse.json(GROUPS);
  }),

  // 질문 받아오기
  http.get(VITE_API_BASE + "/api/meetings/:meetingId/questions", (req) => {
    const { meetingId } = req.params; // meetingId 파라미터 접근
    console.log(meetingId);  // 도커 확인을 위해 잠시 추가
    return HttpResponse.json(QUESTIONS);
  }),
];

export default handlers;
