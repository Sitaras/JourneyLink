import { z } from "zod";
import { isoDateSchema } from "../isoDateSchema";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, {
      error: "required"
}).optional(),

  lastName: z.string().trim().min(1, {
      error: "required"
}).optional(),

  dateOfBirth: isoDateSchema.optional(),

  email: z.email({
        error: "emailError"
  }).trim().optional(),

  phoneNumber: z
    .string()
    .trim()
    .regex(greekPhoneNumber, {
        error: "Invalid format"
    })
    .optional(),

  bio: z.string().trim().max(500, "Maximum 500 characters").optional(),

  socials: z
    .object({
      facebook: z.url("Invalid URL").or(z.literal("")).optional(),
      twitter: z.url("Invalid URL").or(z.literal("")).optional(),
      linkedIn: z.url("Invalid URL").or(z.literal("")).optional(),
    })
    .optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
