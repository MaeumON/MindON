export function dateChanger(date: string, type: string) {
  const year = date.split(" ")[0].split("-")[0];
  const month = date.split(" ")[0].split("-")[1];
  const day = date.split(" ")[0].split("-")[2];

  const time = date.split(" ")[1];
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
