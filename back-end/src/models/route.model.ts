import { Schema, Document, model } from "mongoose";
import { IRoute } from "../types/route.types";

interface IRouteDocument extends IRoute, Document {}

const routeSchema = new Schema<IRouteDocument>(
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
          enum: ["pending", "confirmed", "cancelled"],
          default: "pending",
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
      maxTwoInBack: {
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
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    cancellationReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

routeSchema.index({
  "origin.coordinates": "2dsphere",
  "destination.coordinates": "2dsphere",
  departureTime: 1,
});

// routeSchema.index({ "origin.coordinates": "2dsphere" });

// routeSchema.index({ "destination.coordinates": "2dsphere" });

routeSchema.index({
  "origin.city": 1,
  "destination.city": 1,
  departureTime: 1,
});

routeSchema.index({ status: 1, departureTime: 1 });

routeSchema.virtual("remainingSeats").get(function () {
  const bookedSeats = this.passengers
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + p.seatsBooked, 0);
  return this.availableSeats - bookedSeats;
});

routeSchema.methods.isBookable = function (requestedSeats = 1) {
  return (
    this.status === "active" &&
    this.remainingSeats >= requestedSeats &&
    this.departureTime > new Date()
  );
};

export const Route = model<IRoute>("Route", routeSchema);
