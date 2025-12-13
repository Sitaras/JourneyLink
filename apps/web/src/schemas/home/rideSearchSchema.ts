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
  dateTrip: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "Date must be in the future",
      }
    )
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        const maxDate = new Date(new Date().getFullYear() + 1, 11, 31);
        return date <= maxDate;
      },
      {
        message: "Date is too far in the future",
      }
    ),
});
