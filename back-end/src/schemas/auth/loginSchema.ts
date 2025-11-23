import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: "emailError",
  }),
  password: z.string().min(1, {
    error: "required",
  }),
});
