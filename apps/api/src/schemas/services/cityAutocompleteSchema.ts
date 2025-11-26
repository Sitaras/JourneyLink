import { z } from "zod";

export const cityAutocompleteSchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(200, "Query too long"),
  maxResults: z
    .int()
    .min(1)
    .max(10, "Maximum 10 results allowed")
    .prefault(5)
    .optional(),
  language: z
    .string()
    .regex(/^[a-z]{2}$/, "Language must be a 2-letter code")
    .prefault("en")
    .optional(),
});
