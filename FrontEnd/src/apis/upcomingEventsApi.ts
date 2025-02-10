import authInstance from "./authinstance";

export async function fetchUpcomingEvent() {
  const response = await authInstance.get("/api/meetings/upcoming");
  return response.data;
}
