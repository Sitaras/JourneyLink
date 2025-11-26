import { UserRideRole } from "../../types/user.types";
import { z } from "zod";

export const getUserRidesQuerySchema = z.object({
  type: z.enum(UserRideRole).prefault(UserRideRole.AS_PASSENGER).optional(),
  sortOrder: z.enum(["asc", "desc"]).prefault("asc").optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type IGetUserRidesQueryPayload = z.infer<typeof getUserRidesQuerySchema>;
