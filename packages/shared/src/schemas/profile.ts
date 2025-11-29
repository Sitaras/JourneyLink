import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, {
      message: "First name is required",
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, {
      message: "Last name is required",
    })
    .optional(),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required",
  }),
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .trim()
    .optional(),
  phoneNumber: z
    .string()
    .min(1, {
      message: "Phone number is required",
    })
    .regex(greekPhoneNumber, {
      message: "Invalid phone number format",
    })
    .optional(),
  bio: z.string().trim().max(500, "Maximum 500 characters").optional(),
  socials: z
    .object({
      facebook: z.string().url("Invalid URL").or(z.literal("")).optional(),
      twitter: z.string().url("Invalid URL").or(z.literal("")).optional(),
      linkedIn: z.string().url("Invalid URL").or(z.literal("")).optional(),
    })
    .optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
