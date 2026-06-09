export const formatNumber = (value?: number | string) => {
  if (value === undefined || value === null || value === "-") return "-";

  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) return "-";

  return num.toLocaleString();
};
