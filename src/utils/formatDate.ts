function formatUtcOffset(date: Date): string {
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = abs % 60;
  return minutes === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

export const formatDate = (dateString: string) => {
  const normalized = dateString.includes("T") ? dateString : dateString.replace(" ", "T");
  const utcDate = normalized.endsWith("Z") ? normalized : `${normalized}Z`;
  const date = new Date(utcDate);

  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  return `${formatted} ${formatUtcOffset(date)}`;
};
