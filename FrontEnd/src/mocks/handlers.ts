import { http, HttpResponse } from "msw";
import { GROUPS } from "../data/GROUPS";
const { VITE_API_BASE } = import.meta.env;

const handlers = [
  http.get(VITE_API_BASE + "/api/groups/list", () => {
    return HttpResponse.json(GROUPS);
  }),
];

export default handlers;
