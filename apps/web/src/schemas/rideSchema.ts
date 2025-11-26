import { z } from "zod";
import { isoDateSchema } from "./isoDateSchema";
import { RideStatus } from "@journey-link/shared";

const coordinatesSchema = z
  .array(z.number())
  .length(2)
  .refine(
    ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    {
      error: "Invalid coordinates format [longitude, latitude]",
    }
  )
  .optional();

const locationSchema = z.object({
  city: z.string(),
  address: z.string().optional(),
  coordinates: coordinatesSchema,
});

const vehicleInfoSchema = z
  .object({
    make: z.string().trim().max(50).optional(),
    model: z.string().trim().max(50).optional(),
    color: z.string().trim().max(30).optional(),
    licensePlate: z.string().trim().max(20).optional(),
  })
  .optional();

const preferencesSchema = z
  .object({
    smokingAllowed: z.boolean().optional().prefault(false),
    petsAllowed: z.boolean().optional().prefault(false),
  })
  .optional();

export const createRideSchema = z
  .object({
    origin: locationSchema,
    destination: locationSchema,
    departureTime: isoDateSchema.refine((date) => new Date(date) > new Date(), {
      error: "Departure time must be in the future",
    }),
    availableSeats: z
      .int("Available seats must be an integer")
      .min(1, "Must have at least 1 available seat")
      .max(8, "Cannot have more than 8 seats"),
    pricePerSeat: z
      .number()
      .nonnegative("Price cannot be negative")
      .max(1000, "Price seems unreasonably high"),
    vehicleInfo: vehicleInfoSchema,
    preferences: preferencesSchema,
    additionalInfo: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => {
      return (
        data.origin.city.toLowerCase() !== data.destination.city.toLowerCase()
      );
    },
    {
      path: ["destination"],
      error: "Origin and destination cities must be different",
    }
  );

export const updateRideSchema = z
  .object({
    origin: locationSchema.optional(),
    destination: locationSchema.optional(),
    departureTime: isoDateSchema.refine((date) => new Date(date) > new Date(), {
      error: "Departure time must be in the future",
    }),
    availableSeats: z.int().min(1).max(8).optional(),
    pricePerSeat: z.number().nonnegative().max(1000).optional(),
    vehicleInfo: vehicleInfoSchema,
    preferences: preferencesSchema,
    additionalInfo: z.string().trim().max(500).optional(),
    status: z.enum(RideStatus).optional(),
  })
  .refine(
    (data) => {
      // If both origin and destination are provided, ensure they're different
      if (data.origin?.city && data.destination?.city) {
        return (
          data.origin.city.toLowerCase() !== data.destination.city.toLowerCase()
        );
      }
      return true;
    },
    {
      path: ["destination"],
      error: "Origin and destination cities must be different",
    }
  );

// Query params schema for GET /rides
export const getRidesQuerySchema = z.object({
  originCity: z.string().trim().optional(),
  destinationCity: z.string().trim().optional(),

  // Geospatial search for origin
  originLat: z.string(),
  originLng: z.string(),
  originRadius: z.string().optional(),

  // Geospatial search for destination
  destinationLat: z.string(),
  destinationLng: z.string(),
  destinationRadius: z.string().optional(),

  // Date and time filters
  departureDate: isoDateSchema.refine((date) => new Date(date) > new Date(), {
    error: "Departure time must be in the future",
  }),

  // Seat and price filters
  minSeats: z.string().optional(),
  maxPrice: z.string().optional(),

  // Preference filters
  smokingAllowed: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),

  // Pagination
  page: z.number().optional(),
  limit: z.number().optional(),

  // Sorting
  sortBy: z
    .enum(["price", "departureTime", "distance"])
    .prefault("departureTime")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).prefault("asc").optional(),
});

// Book ride schema (for future use)
export const bookRideSchema = z.object({
  seatsRequested: z
    .int("Seats must be an integer")
    .min(1, "Must book at least 1 seat")
    .max(8, "Cannot book more than 8 seats"),
  passengerNotes: z.string().trim().max(200).optional(),
});

export const deleteRideSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(5, "Cancellation reason must be at least 5 characters")
      .max(200, "Cancellation reason is too long")
      .optional(),
    notifyPassengers: z.boolean().optional().prefault(true),
  })
  .optional();

export type ICreateRidePayload = z.infer<typeof createRideSchema>;
export type UpdateRideInput = z.infer<typeof updateRideSchema>;
export type IGetRidesQueryPayload = z.infer<typeof getRidesQuerySchema>;
export type BookRideInput = z.infer<typeof bookRideSchema>;
export type IDeleteRidePayload = z.infer<typeof deleteRideSchema>;
