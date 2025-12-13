import { z } from "zod";

export const editRideSchema = z.object({
  dateTrip: z.string().min(1, "Date is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  availableSeats: z.coerce
    .number()
    .min(1, "At least 1 seat is required")
    .max(8, "Maximum 8 seats allowed"),
  pricePerSeat: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(1000, "Price seems too high"),
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
  additionalInfo: z.string().max(500, "Maximum 500 characters").optional(),
});

export type EditRideFormData = z.infer<typeof editRideSchema>;
