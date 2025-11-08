import { z } from "zod";
import { citySchema } from "./citySchema";

export const rideSearchSchema = z
  .object({
    departureLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
        message: "required",
      }),
    arrivalLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
        message: "required",
      }),
    dateTrip: z.union([z.date(), z.undefined()]).refine((val) => Boolean(val), {
      message: "required",
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
      message: "Travel date cannot be in the past",
      path: ["dateTrip"],
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
      message: "Departure and arrival locations must be different",
      path: ["arrivalLocation"],
    }
  );
