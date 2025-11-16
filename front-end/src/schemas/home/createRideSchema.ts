import z from "zod";
import { citySchema } from "./citySchema";
import { parsePrice } from "@/utils/moneysUtils";

export const createRideSchema = z
  .object({
    departureLocation: citySchema,
    arrivalLocation: citySchema,
    dateTrip: z.date(),
    time: z.string().min(1, {
        error: "required"
    }),
    availableSeats: z
      .string()
      .min(1, {
          error: "required"
    })
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 8;
        },
        {
            error: "Must be between 1 and 8"
        }
      ),
    pricePerSeat: z
      .string()
      .min(1, {
          error: "Price per seat is required"
    })
      .refine(
        (val) => {
          const num = parsePrice(val);
          return num !== null && num >= 0 && num <= 1000;
        },
        {
            error: "Price must be between 0 and 1000"
        }
      )
      .refine(
        (val) => {
          const num = parsePrice(val);
          if (num === null) return false;
          const decimals = num.toString().split(".")[1];
          return !decimals || decimals.length <= 2;
        },
        {
            error: "Price can have at most 2 decimal digits"
        }
      ),
    smoking: z.boolean(),
    petsAllowed: z.boolean(),
    additionalInfo: z.string().optional(),
  })
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

export type CreateRideFormValues = z.infer<typeof createRideSchema>;
