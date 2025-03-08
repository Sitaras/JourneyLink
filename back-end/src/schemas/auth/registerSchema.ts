import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const isoDateSchema = z
  .string()
  .min(1, { message: "required" })
  .refine(
    (value) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value))
        return false;
      const d = new Date(value);
      return !isNaN(d.getTime()) && d.toISOString() === value;
    },
    {
      message: "String must be a valid ISO date format",
    }
  );

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
  email: z
    .string()
    .min(1, { message: "required" })
    .email({ message: "Invalid format" }),
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
