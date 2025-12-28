import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: (issue) => (!issue.input ? "REQUIRED" : "INVALID_EMAIL_ADDRESS"),
  }),
  password: z.string().min(1, {
    message: "REQUIRED",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
