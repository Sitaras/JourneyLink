import z from "zod";
import { citySchema } from "./citySchema";
import { parsePrice } from "@/utils/moneysUtils";

export const createRideSchema = z
  .object({
    departureLocation: citySchema,
    arrivalLocation: citySchema,
    dateTrip: z.date(),
    time: z.string().min(1, { message: "required" }),
    availableSeats: z
      .string()
      .min(1, { message: "required" })
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 8;
        },
        {
          message: "Must be between 1 and 8",
        }
      ),
    pricePerSeat: z
      .string()
      .min(1, { message: "Price per seat is required" })
      .refine(
        (val) => {
          const num = parsePrice(val);
          return num !== null && num >= 0 && num <= 1000;
        },
        {
          message: "Price must be between 0 and 1000",
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
          message: "Price can have at most 2 decimal digits",
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
      message: "Departure and arrival locations must be different",
      path: ["arrivalLocation"],
    }
  );

export type CreateRideFormValues = z.infer<typeof createRideSchema>;
