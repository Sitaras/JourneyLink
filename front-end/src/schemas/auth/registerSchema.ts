import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const passwordSchema = z
  .string()
  .min(1, { message: "required" })
  .min(8, { message: "minLengthErrorMessage" })
  .max(20, { message: "maxLengthErrorMessage" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "uppercaseErrorMessage",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "lowercaseErrorMessage",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "numberErrorMessage",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "specialCharacterErrorMessage",
  });

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "required" })
      .email({ message: "emailError" }),
    firstName: z.string().min(1, { message: "required" }),
    lastName: z.string().min(1, { message: "required" }),
    phoneNumber: z
      .string()
      .min(1, { message: "required" })
      .regex(greekPhoneNumber, {
        message: "phoneNumberError",
      }),
    dateOfBirth: z.string().min(1, { message: "required" }),
    password: passwordSchema,
    verifyPassword: z.string().min(1, { message: "required" }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "passwordMatch",
    path: ["verifyPassword"],
  });
