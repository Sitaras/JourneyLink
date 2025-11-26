import { z } from "zod";
import { BookingStatus } from "@journey-link/shared";

export const createBookingSchema = z.object({
  rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(BookingStatus),
});

export type ICreateBookingPayload = z.infer<typeof createBookingSchema>;
