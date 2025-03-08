import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "required" }),
  password: z.string().min(1, { message: "required" }),
});
