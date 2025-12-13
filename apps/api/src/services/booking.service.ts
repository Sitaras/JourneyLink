import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { isUserInRide } from "../utils/rideUtils";
import { ICreateBookingPayload } from "@journey-link/shared";
import { BookingStatus } from "@journey-link/shared";
import { StatusCodes } from "http-status-codes";

export class BookingService {
  async createBooking(userId: string, data: ICreateBookingPayload) {
    const { rideId } = data;

    if (!Types.ObjectId.isValid(rideId)) {
      throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid Ride ID" };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Ride is not available for booking.",
      };
    }

    if (rideDoc.driver.toString() === userId) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Driver cannot book their own ride.",
      };
    }

    if (await isUserInRide(userId, rideId)) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User already in ride or has pending booking.",
      };
    }

    rideDoc.passengers.push({
      user: new Types.ObjectId(userId),
      seatsBooked: 1,
      status: BookingStatus.PENDING,
    });
    await rideDoc.save();

    const booking = await Booking.create({
      passenger: userId,
      driver: rideDoc.driver,
      ride: rideId,
      status: BookingStatus.PENDING,
    });

    return {
      bookingId: booking._id,
      status: booking.status,
    };
  }

  async acceptBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Booking not found" };
    }

    if (booking.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized to accept this booking",
      };
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Booking cannot be accepted not in Pending Status",
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Ride for this booking not found",
      };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Ride is not Bookable.",
      };
    }

    booking.status = BookingStatus.CONFIRMED;
    await booking.save();

    const passengerEntry = rideDoc.passengers.find(
      (p) => p.user.toString() === booking.passenger.toString()
    );

    if (passengerEntry) {
      passengerEntry.status = BookingStatus.CONFIRMED;
      await rideDoc.save();
    }

    return { status: booking.status };
  }

  async declineBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Booking not found" };
    }

    if (booking.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized to decline this booking",
      };
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Booking cannot be declined, not in Pending Status",
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Ride for this booking not found",
      };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Ride is not Bookable.",
      };
    }

    booking.status = BookingStatus.DECLINED;
    await booking.save();

    const passengerEntry = rideDoc.passengers.find(
      (p) => p.user.toString() === booking.passenger.toString()
    );

    if (passengerEntry) {
      passengerEntry.status = BookingStatus.DECLINED;
      await rideDoc.save();
    }

    return { status: booking.status };
  }

  async getRideBookings(rideId: string, driverId: string) {
    if (!Types.ObjectId.isValid(rideId)) {
      throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid Ride ID" };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    if (rideDoc.driver.toString() !== driverId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "Not authorized to view bookings for this ride",
      };
    }

    return await Booking.find({ ride: rideId })
      .populate("passenger", "profile email phoneNumber")
      .populate("ride", "origin destination departureTime pricePerSeat")
      .sort({ createdAt: -1 });
  }

  async getPendingBookings(rideId: string, driverId: string) {
    if (!Types.ObjectId.isValid(rideId)) {
      throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid Ride ID" };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    if (rideDoc.driver.toString() !== driverId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "Not authorized to view bookings for this ride",
      };
    }

    return await Booking.find({
      ride: rideId,
      status: BookingStatus.PENDING,
    })
      .populate("passenger", "profile email phoneNumber")
      .sort({ createdAt: -1 });
  }
}

export const bookingService = new BookingService();
