import { z } from "zod";

export const isoDateSchema = z
  .string()
  .min(1, { message: "required" })
  .refine(
    (value) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value))
        return false;
      const d = new Date(value);
      return !isNaN(d.getTime()) && d.toISOString() === value;
    },
    {
      message: "String must be a valid ISO date format",
    }
  );
