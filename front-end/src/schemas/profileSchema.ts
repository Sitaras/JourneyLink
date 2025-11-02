import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, { message: "required" }).optional(),
  lastName: z.string().trim().min(1, { message: "required" }).optional(),
  dateOfBirth: z.string().min(1, { message: "required" }),
  email: z.string().trim().email({ message: "emailError" }).optional(),
  phoneNumber: z
    .string()
    .min(1, { message: "required" })
    .regex(greekPhoneNumber, {
      message: "Invalid format",
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
