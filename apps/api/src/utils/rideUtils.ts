import { BookingStatus } from "@journey-link/shared";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";

export const isUserInRide = async (userId: string, rideId: string) => {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(rideId))
    return false;

  // Check if user is already a passenger in the ride
  const ride = await Ride.findById(rideId);
  if (!ride) return false;

  const inRide = ride.passengers.some(
    (p) =>
      p.user.toString() === userId &&
      [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(p.status)
  );
  if (inRide) return true;

  // Check if user has a pending booking for the ride
  const pendingBooking = await Booking.findOne({
    passenger: userId,
    ride: rideId,
    status: BookingStatus.PENDING,
  });

  return !!pendingBooking;
};
