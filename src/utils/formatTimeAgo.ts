export const formatTimeAgo = (dateString: string, locale: string = "en"): string => {
  if (!dateString || dateString === "-") return "-";

  const isoLike = dateString.replace(" ", "T");
  const hasTz = /[zZ]|[+-]\d{2}:?\d{2}$/.test(isoLike);
  const date = new Date(hasTz ? isoLike : isoLike + "Z");

  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);

  if (Math.abs(seconds) < 60) return rtf.format(-seconds, "second");
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(-hours, "hour");
  if (Math.abs(days) < 30) return rtf.format(-days, "day");
  if (Math.abs(months) < 12) return rtf.format(-months, "month");

  return date.toLocaleDateString(locale);
};
