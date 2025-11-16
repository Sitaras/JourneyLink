export const generateQueryString = (payload: object) => {
  return new URLSearchParams(
    Object.entries(payload)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();
};
