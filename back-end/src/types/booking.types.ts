import { Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "cancelled",
}

export interface IBooking {
  passenger: Types.ObjectId;
  driver: Types.ObjectId;
  ride: Types.ObjectId;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
