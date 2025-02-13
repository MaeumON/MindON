import { http, HttpResponse } from "msw";
// import { GROUPS } from "../data/GROUPS";
// import { QUESTIONS } from "../data/QUESTIONS";
// import { LOGINUSER } from "../data/LOGINUSER";
// import { FINDID } from "../data/FINDID";
// import { FINDPWD } from "../data/FINDPWD";
// import { QUESTION_SPEAKING_ORDER } from "@/data/OPENVIDU";
// import { TEMPERATURE } from "@/data/TEMPERTURE";
// import { GROUPSDETAIL } from "@/data/GROUPDETAIL";
// import { MEETINGDETIAL } from "@/data/MEETINGDETAIL";
// import { UPCOMING_EVENTS } from "@/data/UPCOMING_EVENTS";
// import { Group, RequestData } from "@/apis/group/groupListApi";
// import { TOPFIVEGROUPS } from "@/data/TOPFIVEGROUPS";
// import { RequestData, Group } from "@/utils/groups";

// const ITEMS_PER_PAGE = 5; // 한 페이지당 반환할 그룹 개수

const handlers = [
  http.get("", () => {
    return HttpResponse.json({ test: "test" });
  }),

  // //아이디 중복 체크
  // http.post("/api/auth/check-id", () => {
  //   return HttpResponse.json({ data: true });
  // }),

  // 질문 받아오기
  // http.get(VITE_APP_API_URL + "/api/meetings/:meetingId/questions", (req) => {
  //   const { meetingId } = req.params; // meetingId 파라미터 접근
  //   //쓰지 않는 변수 처리용
  //   console.log(meetingId);
  //   return HttpResponse.json(QUESTIONS);
  // }),
  // User Login 정보
  // http.post(VITE_APP_API_URL + "/api/auth/login", () => {
  //   return HttpResponse.json(LOGINUSER);
  // }),
  // FindId 정보
  // http.post(VITE_APP_API_URL + "/api/auth/userid", () => {
  //   return HttpResponse.json(FINDID);
  // }),
  // FindPwd 정보
  // http.post(VITE_APP_API_URL + "/api/auth/password", () => {
  //   return HttpResponse.json(FINDPWD);
  // }),
  // // GroupsList 정보
  // http.post(VITE_APP_API_URL + "/api/groups/list", async ({ request }) => {
  //   const filters = (await request.json()) as Partial<RequestData>;
  //   console.log("📌 MSW 요청 필터 데이터:", filters);
  //   const filteredGroups = filterGroups(GROUPS, filters);
  //   console.log("📌 MSW 필터링된 데이터:", filteredGroups);
  //   return HttpResponse.json(filteredGroups);
  // }),
  // GroupDetail 정보
  // http.get(VITE_APP_API_URL + "/api/groups/:groupId", ({ params }) => {
  //   const { groupId } = params;
  //   const filteredGroup = GROUPSDETAIL.find((g) => g.groupId === Number(groupId));
  //   if (!filteredGroup) {
  //     return new HttpResponse("그룹을 찾을 수 없습니다.", { status: 404 });
  //   }
  //   return HttpResponse.json(filteredGroup);
  // }),
  // // TopFiveGroups 리스트트
  // http.get(VITE_APP_API_URL + "/api/groups/:diseaseId/new", () => {
  //   return HttpResponse.json(TOPFIVEGROUPS);
  // }),
  // // 그룹 목록 조회 (GET 요청)
  // http.get(VITE_APP_API_URL + "/api/groups/list", ({ request }) => {
  //   const url = new URL(request.url);
  //   const page = parseInt(url.searchParams.get("page") || "1", 10); // page 값 가져오기, 기본값 1
  //   // 페이지네이션 적용
  //   const startIndex = (page - 1) * ITEMS_PER_PAGE;
  //   const endIndex = startIndex + ITEMS_PER_PAGE;
  //   const paginatedGroups = GROUPS.slice(startIndex, endIndex);
  //   console.log(`📌 MSW Mock API (GET) - page ${page}:`, paginatedGroups.length, "개 반환");
  //   return HttpResponse.json(paginatedGroups);
  // }),
  // // 그룹 목록 조회 (POST 요청)
  // http.post(VITE_APP_API_URL + "/api/groups/list", async ({ request }) => {
  //   const body = await request.json().catch(() => ({})); //  body가 없을 경우 기본값 `{}` 설정
  //   const page = parseInt(body.page, 10) || 1; //  `undefined`일 경우 기본값 1 적용
  //   // 페이지네이션 적용
  //   const startIndex = (page - 1) * ITEMS_PER_PAGE;
  //   const endIndex = startIndex + ITEMS_PER_PAGE;
  //   const paginatedGroups = GROUPS.slice(startIndex, endIndex);
  //   console.log(`📌 MSW Mock API (POST) - page ${page}:`, paginatedGroups.length, "개 반환");
  //   return HttpResponse.json(paginatedGroups);
  // }),
  // 마음온도 정보
  // http.get(VITE_APP_API_URL + "/api/users/temparature", () => {
  //   return HttpResponse.json({ temperture: TEMPERATURE.temperture });
  // }),
  // // 마이데이터 리뷰조회
  // http.get(VITE_APP_API_URL + "/api/groups/:groupId/reviews", (req) => {
  //   const { groupId } = req.params;
  //   console.log(groupId);
  //   return HttpResponse.json(MEETINGDETIAL);
  // }),
  // SignUp 정보
  // 성공함함
  // http.post(VITE_APP_API_URL + "/api/auth/signup", () => {
  //   new HttpResponse("Create", {
  //     status: 201,
  //     headers: {
  //       "Content-Type": "text/plain",
  //     },
  //   });
  // }),
  // http.post(VITE_APP_API_URL + "/api/video/sessions", () => {
  //   return HttpResponse.json(OPENVIDU_SESSION);
  // }),
  //질문 발언 순서 받아오기
  // http.get(VITE_APP_API_URL + "/api/users/:groupId/list", (req) => {
  //   const { groupId } = req.params; // groupId 파라미터 접근
  //   //쓰지 않는 변수 처리용
  //   console.log(groupId);
  //   return HttpResponse.json(QUESTION_SPEAKING_ORDER);
  // }),
  // upcoming 이벤트 조회
  // http.get(VITE_APP_API_URL + "/api/meetings/upcoming", () => {
  //   return HttpResponse.json(UPCOMING_EVENTS);
  // }),
];

export default handlers;
