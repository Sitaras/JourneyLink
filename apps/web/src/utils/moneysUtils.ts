export const parsePrice = (value: string): number | null => {
  if (!value) return null;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsedAmount = Number(normalized);
  return isNaN(parsedAmount) ? null : parsedAmount;
};
