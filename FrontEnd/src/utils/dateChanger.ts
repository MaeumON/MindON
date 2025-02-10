export function dateChanger(date: string, type: string) {
  const dateString = date.split("T")[0];
  const year = dateString.split("-")[0];
  const month = dateString.split("-")[1];
  const day = dateString.split("-")[2];

  const time = date.split("T")[1];
  const hour = time.split("-")[0];
  const minute = time.split("-")[1];
  const second = time.split("-")[2];

  if (type === "year") return year;
  else if (type === "month") return month;
  else if (type === "day") return day;
  else if (type === "hour") return hour;
  else if (type === "minute") return minute;
  else if (type === "second") return second;
}
