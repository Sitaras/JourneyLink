import { z } from "zod";

export const isoDateSchema = z
  .string()
  .min(1, {
    error: "REQUIRED",
  })
  .refine(
    (value) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value))
        return false;
      const parsedDate = new Date(value);
      return !isNaN(parsedDate.getTime()) && parsedDate.toISOString() === value;
    },
    {
      error: "String must be a valid ISO date format",
    }
  );
