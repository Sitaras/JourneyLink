import { z } from "zod";

export const bookSeatSchema = z.object({
  rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
});

export type IBookSeatPayload = z.infer<typeof bookSeatSchema>;
