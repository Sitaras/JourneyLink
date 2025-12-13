import { z } from "zod";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const urlRegex =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

const flexibleUrlSchema = z
  .string()
  .regex(urlRegex, "Invalid URL format")
  .or(z.literal(""));

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, {
      error: "required",
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, {
      error: "required",
    })
    .optional(),
  dateOfBirth: z
    .string()
    .min(1, {
      error: "required",
    })
    .optional(),
  email: z
    .email({
      error: "emailError",
    })
    .trim()
    .optional(),
  phoneNumber: z
    .string()
    .min(1, {
      error: "required",
    })
    .regex(greekPhoneNumber, {
      error: "Invalid format",
    })
    .optional(),
  bio: z.string().trim().max(500, "Maximum 500 characters").optional(),
  socials: z
    .object({
      facebook: flexibleUrlSchema.optional(),
      twitter: flexibleUrlSchema.optional(),
      linkedIn: flexibleUrlSchema.optional(),
    })
    .optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
