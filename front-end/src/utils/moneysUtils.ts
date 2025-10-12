export const parsePrice = (value: string): number | null => {
  if (!value) return null;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const num = Number(normalized);
  return isNaN(num) ? null : num;
};
