import { z } from "zod";

export const createBookingSchema = z.object({
  rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export type ICreateBookingPayload = z.infer<typeof createBookingSchema>;
