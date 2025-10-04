import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "required" })
    .email({ message: "emailError" }),
  password: z.string().min(1, { message: "required" }),
});
