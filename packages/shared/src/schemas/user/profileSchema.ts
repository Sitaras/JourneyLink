import { z } from "zod";
import { ErrorCodes } from "../../constants/errorCodes";

const greekPhoneNumber = new RegExp(/^(?:[0-9]{10})$/);

const urlRegex =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

const flexibleUrlSchema = z
  .string()
  .regex(urlRegex, ErrorCodes.INVALID_PHONE_FORMAT)
  .or(z.literal(""));

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .optional(),
  dateOfBirth: z
    .string()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .optional(),
  email: z
    .email({
      message: ErrorCodes.INVALID_EMAIL_ADDRESS,
    })
    .trim()
    .optional(),
  phoneNumber: z
    .string()
    .min(1, {
      message: ErrorCodes.REQUIRED,
    })
    .regex(greekPhoneNumber, {
      message: ErrorCodes.INVALID_PHONE_FORMAT,
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
