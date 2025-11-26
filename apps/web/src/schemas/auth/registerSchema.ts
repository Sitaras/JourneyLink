import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const passwordSchema = z
  .string()
  .min(1, {
    error: "required",
  })
  .min(8, {
    error: "minLengthErrorMessage",
  })
  .max(20, {
    error: "maxLengthErrorMessage",
  })
  .refine((password) => /[A-Z]/.test(password), {
    error: "uppercaseErrorMessage",
  })
  .refine((password) => /[a-z]/.test(password), {
    error: "lowercaseErrorMessage",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "numberErrorMessage",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    error: "specialCharacterErrorMessage",
  });

export const registerSchema = z
  .object({
    email: z
      .email({
        error: "emailError",
      })
      .min(1, {
        error: "required",
      }),
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
        error: "phoneNumberError",
      }),
    dateOfBirth: z.string().min(1, {
      error: "required",
    }),
    password: passwordSchema,
    verifyPassword: z.string().min(1, {
      error: "required",
    }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    path: ["verifyPassword"],
    error: "passwordMatch",
  });
