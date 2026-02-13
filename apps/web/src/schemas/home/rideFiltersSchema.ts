import { z } from "zod";
import { RideSortBy, SortOrder } from "@journey-link/shared";

export const rideFiltersSchema = z.object({
  maxPrice: z.string().optional(),
  minSeats: z.string().optional(),
  smokingAllowed: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  sortBy: z.enum(RideSortBy).optional(),
  sortOrder: z.enum(SortOrder).optional(),
});

export type RideFiltersFormValues = z.infer<typeof rideFiltersSchema>;
