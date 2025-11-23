import { UserRideRole } from "../../types/user.types";
import { z } from "zod";

export const getUserRidesQuerySchema = z.object({
  type: z.enum(UserRideRole).prefault(UserRideRole.AS_PASSENGER).optional(),
  sortOrder: z.enum(["asc", "desc"]).prefault("asc").optional(),
  page: z
    .string()
    .prefault("1")
    .transform((val) => (val ? parseInt(val) : undefined))
    .pipe(z.int().min(1).prefault(1))
    .optional(),
  limit: z
    .string()
    .prefault("10")
    .transform((val) => (val ? parseInt(val) : undefined))
    .pipe(z.int().min(1).max(100).prefault(10))
    .optional(),
});

export type IGetUserRidesQueryPayload = z.infer<typeof getUserRidesQuerySchema>;
