import { z } from "zod";

export const createBookingSchema = z.object({
    ride: z.string().min(24).max(24),
});

export const updateBookingStatusSchema = z.object({
    status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const mongoIdSchema = z.object({
    id: z.string().min(24).max(24),
});

export const getBookingsQuerySchema = z.object({
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
    passenger: z.string().min(24).max(24).optional(),
    driver: z.string().min(24).max(24).optional(),
});