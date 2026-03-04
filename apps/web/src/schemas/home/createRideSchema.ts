import z from "zod";
import { citySchema } from "./citySchema";
import { parsePrice } from "@/utils/moneysUtils";

import { t } from "@lingui/core/macro";

export const createCreateRideSchema = () =>
  z
    .object({
      departureLocation: citySchema,
      arrivalLocation: citySchema,
      dateTrip: z.coerce.date(),
      time: z.string().min(1, {
        message: t`required`,
      }),
      availableSeats: z
        .string()
        .min(1, {
          message: t`required`,
        })
        .refine(
          (val) => {
            const parsedSeatCount = Number(val);
            return !isNaN(parsedSeatCount) && Number.isInteger(parsedSeatCount) && parsedSeatCount >= 1 && parsedSeatCount <= 8;
          },
          {
            message: t`Must be between 1 and 8`,
          }
        ),
      pricePerSeat: z
        .string()
        .min(1, {
          message: t`Price per seat is required`,
        })
        .refine(
          (val) => {
            const parsedPrice = parsePrice(val);
            return parsedPrice !== null && parsedPrice >= 0 && parsedPrice <= 1000;
          },
          {
            message: t`Price must be between 0 and 1000`,
          }
        )
        .refine(
          (val) => {
            const parsedPrice = parsePrice(val);
            if (parsedPrice === null) return false;
            const decimals = parsedPrice.toString().split(".")[1];
            return !decimals || decimals.length <= 2;
          },
          {
            message: t`Price can have at most 2 decimal digits`,
          }
        ),
      smoking: z.boolean(),
      petsAllowed: z.boolean(),
      additionalInfo: z.string().optional(),
      vehicleMake: z.string().min(1, { message: t`Vehicle make is required` }),
      vehicleModel: z
        .string()
        .min(1, { message: t`Vehicle model is required` }),
      vehicleColor: z
        .string()
        .min(1, { message: t`Vehicle color is required` }),
      vehiclePlate: z
        .string()
        .min(1, { message: t`License plate is required` }),
    })
    .refine(
      (data) => {
        if (!data.departureLocation || !data.arrivalLocation) return true;
        return (
          data.departureLocation.coordinates !==
          data.arrivalLocation.coordinates
        );
      },
      {
        path: ["arrivalLocation"],
        message: t`Departure and arrival locations must be different`,
      }
    );

export type CreateRideFormValues = z.infer<
  ReturnType<typeof createCreateRideSchema>
>;
