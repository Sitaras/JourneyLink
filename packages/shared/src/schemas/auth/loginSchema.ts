import { z } from "zod";
import { ErrorCodes } from "../../constants/errorCodes";

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      !issue.input ? ErrorCodes.REQUIRED : ErrorCodes.INVALID_EMAIL_ADDRESS,
  }),
  password: z.string().min(1, {
    message: ErrorCodes.REQUIRED,
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
