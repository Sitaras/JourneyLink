import { z } from "zod";
import { isoDateSchema } from "../isoDateSchema";
import { ErrorCodes } from "../../constants/errorCodes";
const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

export const registerSchemaBase = z.object({
  email: z.email({
    error: (issue) =>
      !issue.input ? ErrorCodes.REQUIRED : ErrorCodes.INVALID_EMAIL_ADDRESS,
  }),
  firstName: z.string().min(1, {
    message: ErrorCodes.REQUIRED,
  }),
  lastName: z.string().min(1, {
    message: ErrorCodes.REQUIRED,
  }),
  phoneNumber: z
    .string()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .regex(greekPhoneNumber, {
      message: ErrorCodes.INVALID_PHONE_FORMAT,
    }),
  dateOfBirth: isoDateSchema,
  password: z
    .string()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .min(8, {
      message: ErrorCodes.PASSWORD_MIN_LENGTH,
    })
    .max(20, {
      message: ErrorCodes.PASSWORD_MAX_LENGTH,
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: ErrorCodes.PASSWORD_UPPERCASE_REQUIRED,
    })
    .refine((password) => /[a-z]/.test(password), {
      message: ErrorCodes.PASSWORD_LOWERCASE_REQUIRED,
    })
    .refine((password) => /[0-9]/.test(password), {
      message: ErrorCodes.PASSWORD_NUMBER_REQUIRED,
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: ErrorCodes.PASSWORD_SPECIAL_CHAR_REQUIRED,
    }),
  verifyPassword: z.string().min(1, {
    message: ErrorCodes.REQUIRED,
  }),
});

export const registerSchema = registerSchemaBase.refine(
  (data) => data.password === data.verifyPassword,
  {
    path: ["verifyPassword"],
    message: ErrorCodes.PASSWORDS_DO_NOT_MATCH,
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;
