import { z } from "zod";
import { isoDateSchema } from "./isoDateSchema";
import { RideStatus, RideSortBy, SortOrder } from "../types/ride.types";

const coordinatesSchema = z
  .array(z.number())
  .length(2)
  .refine(
    ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    {
      error: "Invalid coordinates format [longitude, latitude]",
    }
  );

const locationSchema = z.object({
  city: z
    .string()
    .trim()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name is too long"),
  address: z.string().trim().max(255).optional(),
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

// Query params schema for GET /ride
export const getRideQuerySchema = z
  .object({
    // Text-based search (fuzzy)
    originCity: z.string().trim().optional(),
    destinationCity: z.string().trim().optional(),

    // Geospatial search for origin
    originLat: z
      .string()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(-90, "Latitude must be between -90 and 90")
          .max(90, "Latitude must be between -90 and 90")
      ),
    originLng: z
      .string()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(-180, "Longitude must be between -180 and 180")
          .max(180, "Longitude must be between -180 and 180")
      ),
    originRadius: z
      .string()
      .prefault("50")
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(1, "Radius must be at least 1km")
          .max(500, "Radius cannot exceed 500km")
          .prefault(50)
      )
      .optional(),

    // Geospatial search for destination
    destinationLat: z
      .string()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(-90, "Latitude must be between -90 and 90")
          .max(90, "Latitude must be between -90 and 90")
      ),
    destinationLng: z
      .string()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(-180, "Longitude must be between -180 and 180")
          .max(180, "Longitude must be between -180 and 180")
      ),
    destinationRadius: z
      .string()
      .prefault("50")
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(
        z
          .number()
          .min(1, "Radius must be at least 1km")
          .max(500, "Radius cannot exceed 500km")
          .prefault(50)
      )
      .optional(),

    // Date and time filters
    departureDate: isoDateSchema
      .refine((date) => new Date(date) > new Date(), {
        error: "Departure time must be in the future",
      })
      .optional(),

    // Seat and price filters
    minSeats: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : undefined))
      .pipe(z.int().min(1).max(8).optional()),
    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().nonnegative().optional()),

    // Preference filters
    smokingAllowed: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        return val === "true" || val === "1";
      })
      .pipe(z.boolean().optional()),
    petsAllowed: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        return val === "true" || val === "1";
      })
      .pipe(z.boolean().optional()),

    // Pagination
    page: z
      .string()
      .prefault("1")
      .transform((val) => (val ? parseInt(val) : undefined))
      .pipe(z.int().min(1).prefault(1))
      .optional(),
    limit: z
      .string()
      .prefault("10")
      .transform((val) => (val ? parseInt(val) : undefined))
      .pipe(z.int().min(1).max(100).prefault(10))
      .optional(),

    // Sorting
    sortBy: z.enum(RideSortBy).prefault(RideSortBy.DEPARTURE_TIME).optional(),
    sortOrder: z.enum(SortOrder).prefault(SortOrder.ASC).optional(),
  })
  .refine(
    (data) => {
      // If originLat is provided, originLng must also be provided
      if (
        (data.originLat && !data.originLng) ||
        (!data.originLat && data.originLng)
      ) {
        return false;
      }
      return true;
    },
    {
      path: ["originLng"],
      error: "Both originLat and originLng must be provided together",
    }
  )
  .refine(
    (data) => {
      // If destinationLat is provided, destinationLng must also be provided
      if (
        (data.destinationLat && !data.destinationLng) ||
        (!data.destinationLat && data.destinationLng)
      ) {
        return false;
      }
      return true;
    },
    {
      path: ["destinationLng"],
      error: "Both destinationLat and destinationLng must be provided together",
    }
  );

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

export const popularRidesSchema = z.object({
  limit: z
    .string()
    .prefault("3")
    .transform((val) => (val ? parseInt(val) : undefined))
    .pipe(z.int().min(1).max(100).prefault(3))
    .optional(),
});

export type ICreateRidePayload = z.infer<typeof createRideSchema>;
export type UpdateRideInput = z.infer<typeof updateRideSchema>;
export type IGetRideQueryPayload = z.infer<typeof getRideQuerySchema>;
export type IGetRideQueryInput = z.input<typeof getRideQuerySchema>;
export type BookRideInput = z.infer<typeof bookRideSchema>;
export type IDeleteRidePayload = z.infer<typeof deleteRideSchema>;
export type IPopularRidesPayload = z.infer<typeof popularRidesSchema>;
