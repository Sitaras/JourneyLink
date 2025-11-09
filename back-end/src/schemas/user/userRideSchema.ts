import { UserRideRole } from "../../types/user.types";
import { z } from "zod";

export const getUserRidesQuerySchema = z.object({
  type: z
    .nativeEnum(UserRideRole)
    .default(UserRideRole.AS_PASSENGER)
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

export type IGetUserRidesQueryPayload = z.infer<typeof getUserRidesQuerySchema>;
