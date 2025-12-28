import { z } from "zod";

import { t } from "@lingui/core/macro";

export const createEditRideSchema = () =>
  z.object({
    dateTrip: z.string().min(1, t`Date is required`),
    departureTime: z.string().min(1, t`Departure time is required`),
    availableSeats: z.coerce
      .number()
      .min(1, t`At least 1 seat is required`)
      .max(8, t`Maximum 8 seats allowed`),
    pricePerSeat: z.coerce
      .number()
      .min(0, t`Price cannot be negative`)
      .max(1000, t`Price seems too high`),
    vehicleInfo: z
      .object({
        make: z.string().optional(),
        model: z.string().optional(),
        color: z.string().optional(),
        licensePlate: z.string().optional(),
      })
      .optional(),
    preferences: z.object({
      smokingAllowed: z.boolean(),
      petsAllowed: z.boolean(),
    }),
    additionalInfo: z
      .string()
      .max(500, t`Maximum 500 characters`)
      .optional(),
  });

export type EditRideFormData = z.infer<ReturnType<typeof createEditRideSchema>>;
