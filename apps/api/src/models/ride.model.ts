import { Schema, Document, model } from "mongoose";
import { RideStatus, BookingStatus } from "@journey-link/shared";
import { IRide } from "../types/ride.types";

export interface IRideDocument extends IRide, Document {
  isBookable(requestedSeats?: number): boolean;
  remainingSeats: number;
  getBookingStatus(
    userId: string,
    requestedSeats?: number
  ): { canBook: boolean; reason: string | null };
}

const rideSchema = new Schema<IRideDocument>(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    origin: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    destination: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    departureTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    passengers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        seatsBooked: {
          type: Number,
          default: 1,
        },
        status: {
          type: String,
          enum: Object.values(BookingStatus),
          default: BookingStatus.PENDING,
        },
      },
    ],
    vehicleInfo: {
      make: String,
      model: String,
      color: String,
      licensePlate: String,
    },
    preferences: {
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
    },
    additionalInfo: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.ACTIVE,
    },
    cancellationReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

rideSchema.index({
  "origin.coordinates": "2dsphere",
  "destination.coordinates": "2dsphere",
  departureTime: 1,
});

// routeSchema.index({ "origin.coordinates": "2dsphere" });

// routeSchema.index({ "destination.coordinates": "2dsphere" });

rideSchema.index({
  "origin.city": 1,
  "destination.city": 1,
  departureTime: 1,
});

rideSchema.index({ status: 1, departureTime: 1 });

rideSchema.virtual("remainingSeats").get(function () {
  const bookedSeats = this.passengers
    .filter((p) => p.status === BookingStatus.CONFIRMED)
    .reduce((sum, p) => sum + p.seatsBooked, 0);
  return this.availableSeats - bookedSeats;
});

rideSchema.virtual("bookedSeats").get(function () {
  const bookedSeats = this.passengers
    .filter((p) => p.status === BookingStatus.CONFIRMED)
    .reduce((sum, p) => sum + p.seatsBooked, 0);
  return bookedSeats;
});

rideSchema.methods.isBookable = function (requestedSeats = 1) {
  return (
    this.status === RideStatus.ACTIVE &&
    this.remainingSeats >= requestedSeats &&
    this.departureTime > new Date()
  );
};

rideSchema.methods.getBookingStatus = function (
  userId: string,
  requestedSeats = 1
) {
  const isDriver = this.driver?.toString() === userId.toString();
  if (isDriver) return { canBook: false, reason: "USER_IS_DRIVER" };

  const isBooked = this.passengers?.some(
    (p: any) =>
      p.user?.toString() === userId.toString() &&
      p.status === BookingStatus.CONFIRMED
  );
  if (isBooked) return { canBook: false, reason: "ALREADY_BOOKED" };

  const hasRequested = this.passengers?.some(
    (p: any) =>
      p.user?.toString() === userId.toString() &&
      p.status === BookingStatus.PENDING
  );
  if (hasRequested) return { canBook: false, reason: "ALREADY_REQUESTED" };

  if ([RideStatus.COMPLETED, RideStatus.CANCELLED].includes(this.status)) {
    return { canBook: false, reason: "RIDE_INACTIVE" };
  }

  if (!this.isBookable(requestedSeats)) {
    return { canBook: false, reason: "NO_AVAILABLE_SEATS" };
  }

  return { canBook: true, reason: null };
};

export const Ride = model<IRideDocument>("Ride", rideSchema);
