import { Types } from "mongoose";
import { BookingStatus } from "@journey-link/shared";

// Mongoose Document interface for Booking
export interface IBooking {
  passenger: Types.ObjectId;
  driver: Types.ObjectId;
  ride: Types.ObjectId;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
