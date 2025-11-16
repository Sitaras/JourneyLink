import { z } from "zod";
import { citySchema } from "./citySchema";

export const rideSearchSchema = z
  .object({
    departureLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
          error: "required"
    }),
    arrivalLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
          error: "required"
    }),
    dateTrip: z.union([z.date(), z.undefined()]).refine((val) => Boolean(val), {
        error: "required"
    }),
  })
  .refine(
    (data) => {
      if (!data.dateTrip) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.dateTrip >= today;
    },
    {
      path: ["dateTrip"],
        error: "Travel date cannot be in the past"
    }
  )
  .refine(
    (data) => {
      if (!data.departureLocation || !data.arrivalLocation) return true;
      return (
        data.departureLocation.coordinates !== data.arrivalLocation.coordinates
      );
    },
    {
      path: ["arrivalLocation"],
        error: "Departure and arrival locations must be different"
    }
  );
