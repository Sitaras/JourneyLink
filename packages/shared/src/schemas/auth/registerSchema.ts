import { z } from "zod";
import { isoDateSchema } from "../isoDateSchema";
const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

export const registerSchemaBase = z.object({
  email: z.email({
    error: (issue) => (!issue.input ? "REQUIRED" : "INVALID_EMAIL_ADDRESS"),
  }),
  firstName: z.string().min(1, {
    message: "REQUIRED",
  }),
  lastName: z.string().min(1, {
    message: "REQUIRED",
  }),
  phoneNumber: z
    .string()
    .min(1, {
      message: "REQUIRED",
    })
    .regex(greekPhoneNumber, {
      message: "INVALID_PHONE_FORMAT",
    }),
  dateOfBirth: isoDateSchema,
  password: z
    .string()
    .min(1, {
      message: "REQUIRED",
    })
    .min(8, {
      message: "PASSWORD_MIN_LENGTH",
    })
    .max(20, {
      message: "PASSWORD_MAX_LENGTH",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "PASSWORD_UPPERCASE_REQUIRED",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "PASSWORD_LOWERCASE_REQUIRED",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "PASSWORD_NUMBER_REQUIRED",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "PASSWORD_SPECIAL_CHAR_REQUIRED",
    }),
  verifyPassword: z.string().min(1, {
    message: "REQUIRED",
  }),
});

export const registerSchema = registerSchemaBase.refine(
  (data) => data.password === data.verifyPassword,
  {
    path: ["verifyPassword"],
    message: "PASSWORDS_DO_NOT_MATCH",
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;
