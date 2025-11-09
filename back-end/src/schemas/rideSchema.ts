import { z } from "zod";
import { isoDateSchema } from "./isoDateSchema";

const coordinatesSchema = z
  .array(z.number())
  .length(2)
  .refine(
    ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    { message: "Invalid coordinates format [longitude, latitude]" }
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
    smokingAllowed: z.boolean().optional().default(false),
    petsAllowed: z.boolean().optional().default(false),
  })
  .optional();

export const createRideSchema = z
  .object({
    origin: locationSchema,
    destination: locationSchema,
    departureTime: isoDateSchema.refine((date) => new Date(date) > new Date(), {
      message: "Departure time must be in the future",
    }),
    availableSeats: z
      .number()
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
      message: "Origin and destination cities must be different",
      path: ["destination"],
    }
  );

export const updateRideSchema = z
  .object({
    origin: locationSchema.optional(),
    destination: locationSchema.optional(),
    departureTime: isoDateSchema.refine((date) => new Date(date) > new Date(), {
      message: "Departure time must be in the future",
    }),
    availableSeats: z.number().int().min(1).max(8).optional(),
    pricePerSeat: z.number().nonnegative().max(1000).optional(),
    vehicleInfo: vehicleInfoSchema,
    preferences: preferencesSchema,
    additionalInfo: z.string().trim().max(500).optional(),
    status: z.enum(["active", "cancelled", "completed"]).optional(),
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
      message: "Origin and destination cities must be different",
      path: ["destination"],
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
      .default("50")
      .transform((val) => parseFloat(val))
      .pipe(
        z
          .number()
          .min(1, "Radius must be at least 1km")
          .max(500, "Radius cannot exceed 500km")
          .default(50)
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
      .default("50")
      .transform((val) => parseFloat(val))
      .pipe(
        z
          .number()
          .min(1, "Radius must be at least 1km")
          .max(500, "Radius cannot exceed 500km")
          .default(50)
      )
      .optional(),

    // Date and time filters
    departureDate: isoDateSchema.refine((date) => new Date(date) > new Date(), {
      message: "Departure time must be in the future",
    }),

    // Seat and price filters
    minSeats: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : undefined))
      .pipe(z.number().int().min(1).max(8).optional()),
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
      .default("1")
      .transform((val) => parseInt(val))
      .pipe(z.number().int().min(1).default(1))
      .optional(),
    limit: z
      .string()
      .default("10")
      .transform((val) => parseInt(val))
      .pipe(z.number().int().min(1).max(100).default(10))
      .optional(),

    // Sorting
    sortBy: z
      .enum(["price", "departureTime", "distance"])
      .default("departureTime")
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
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
      message: "Both originLat and originLng must be provided together",
      path: ["originLng"],
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
      message:
        "Both destinationLat and destinationLng must be provided together",
      path: ["destinationLng"],
    }
  );

// Book ride schema (for future use)
export const bookRideSchema = z.object({
  seatsRequested: z
    .number()
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
    notifyPassengers: z.boolean().optional().default(true),
  })
  .optional();

export type ICreateRidePayload = z.infer<typeof createRideSchema>;
export type UpdateRideInput = z.infer<typeof updateRideSchema>;
export type IGetRideQueryPayload = z.infer<typeof getRideQuerySchema>;
export type BookRideInput = z.infer<typeof bookRideSchema>;
export type IDeleteRidePayload = z.infer<typeof deleteRideSchema>;
