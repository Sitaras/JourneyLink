import { z } from "zod";
import { citySchema } from "./citySchema";

export const rideSearchSchema = z.object({
  departureLocation: z
    .union([citySchema, z.undefined()])
    .refine((val) => Boolean(val), {
      error: "required",
    }),
  arrivalLocation: z
    .union([citySchema, z.undefined()])
    .refine((val) => Boolean(val), {
      error: "required",
    }),
  dateTrip: z.union([z.date(), z.undefined()]).refine((val) => Boolean(val), {
    error: "required",
  }),
});
