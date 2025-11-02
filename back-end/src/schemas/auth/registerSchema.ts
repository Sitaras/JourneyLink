import { z } from "zod";
import { isoDateSchema } from "../isoDateSchema";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const passwordSchema = z
  .string()
  .min(1, { message: "required" })
  .min(8, { message: "Min length 8 characters" })
  .max(20, { message: "Max length 20 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Uppercase letter required",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Lowercase letter required",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Number required",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "Special character required",
  });

export const registerSchema = z.object({
  email: z.string().trim().email({ message: "emailError" }),
  firstName: z.string().min(1, { message: "required" }),
  lastName: z.string().min(1, { message: "required" }),
  phoneNumber: z
    .string()
    .min(1, { message: "required" })
    .regex(greekPhoneNumber, {
      message: "Invalid format",
    }),
  dateOfBirth: isoDateSchema,
  password: passwordSchema,
  verifyPassword: z.string().min(1, { message: "required" }),
});
