import { z } from 'zod';

export const createRideSchema = z.object({
  originCity: z.string().min(1, 'Origin city is required'),
  destinationCity: z.string().min(1, 'Destination city is required'),
  pricePerSeat: z.string().min(1, 'Price is required').regex(/^\d+$/, 'Must be a number'),
  availableSeats: z.string().min(1, 'Seats are required').regex(/^\d+$/, 'Must be a number'),
  vehicleMake: z.string().min(1, 'Make is required'),
  vehicleModel: z.string().min(1, 'Model is required'),
});

export type CreateRideFormValues = z.infer<typeof createRideSchema>;
