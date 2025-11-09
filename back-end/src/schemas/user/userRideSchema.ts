import { UserRideRole } from "../../types/user.types";
import { z } from "zod";

export const getUserRidesQuerySchema = z.object({
  type: z
    .nativeEnum(UserRideRole)
    .default(UserRideRole.AS_PASSENGER)
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(1).default(1))
    .optional(),
  limit: z
    .string()
    .default("10")
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(1).max(100).default(10))
    .optional(),
});

export type IGetUserRidesQueryPayload = z.infer<typeof getUserRidesQuerySchema>;
