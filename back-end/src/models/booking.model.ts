import { Schema, Document, model } from "mongoose";
import { BookingStatus, IBooking } from "../types/booking.types";

interface IBookingDocument extends IBooking, Document {}

const bookingSchema = new Schema<IBookingDocument>(
  {
    passenger: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBookingDocument>("Booking", bookingSchema);
