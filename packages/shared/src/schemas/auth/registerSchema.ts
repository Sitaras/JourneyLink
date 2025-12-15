import { z } from "zod";
import { isoDateSchema } from "../isoDateSchema";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const passwordSchema = z
  .string()
  .min(1, {
    error: "required",
  })
  .min(8, {
    error: "Min length 8 characters",
  })
  .max(20, {
    error: "Max length 20 characters",
  })
  .refine((password) => /[A-Z]/.test(password), {
    error: "Uppercase letter required",
  })
  .refine((password) => /[a-z]/.test(password), {
    error: "Lowercase letter required",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Number required",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    error: "Special character required",
  });

export const registerSchemaBase = z.object({
  email: z
    .email({
      error: "emailError",
    })
    .trim(),
  firstName: z.string().min(1, {
    error: "required",
  }),
  lastName: z.string().min(1, {
    error: "required",
  }),
  phoneNumber: z
    .string()
    .min(1, {
      error: "required",
    })
    .regex(greekPhoneNumber, {
      error: "Invalid format",
    }),
  dateOfBirth: isoDateSchema,
  password: passwordSchema,
  verifyPassword: z.string().min(1, {
    error: "required",
  }),
});

export const registerSchema = registerSchemaBase.refine(
  (data) => data.password === data.verifyPassword,
  {
    path: ["verifyPassword"],
    error: "Passwords do not match",
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;
