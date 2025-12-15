import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { isUserInRide } from "../utils/rideUtils";
import { ICreateBookingPayload } from "@journey-link/shared";
import { BookingStatus, NotificationType } from "@journey-link/shared";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "./notification.service";

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

    const existingPassenger = rideDoc.passengers.find(
      (p) => p.user.toString() === userId
    );

    if (existingPassenger) {
      existingPassenger.status = BookingStatus.PENDING;
      existingPassenger.seatsBooked = 1;
    } else {
      rideDoc.passengers.push({
        user: new Types.ObjectId(userId),
        seatsBooked: 1,
        status: BookingStatus.PENDING,
      });
    }

    await rideDoc.save();

    let booking = await Booking.findOne({
      passenger: userId,
      ride: rideId,
    });

    if (booking) {
      booking.status = BookingStatus.PENDING;
      await booking.save();
    } else {
      booking = await Booking.create({
        passenger: userId,
        driver: rideDoc.driver,
        ride: rideId,
        status: BookingStatus.PENDING,
      });
    }

    // Notify Driver
    await notificationService.createNotification(
      rideDoc.driver.toString(),
      NotificationType.BOOKING_REQUEST,
      "New Booking Request",
      `You have a new booking request for your ride to ${rideDoc.destination.city}`,
      { bookingId: booking._id, rideId: rideId }
    );

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

    await notificationService.createNotification(
      booking.passenger.toString(),
      NotificationType.BOOKING_ACCEPTED,
      "Booking Accepted",
      "Your booking request has been accepted by the driver.",
      { bookingId: booking._id, rideId: booking.ride }
    );

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

    await notificationService.createNotification(
      booking.passenger.toString(),
      NotificationType.BOOKING_DECLINED,
      "Booking Declined",
      "Your booking request has been declined by the driver.",
      { bookingId: booking._id, rideId: booking.ride }
    );

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
      .select("-ride -driver -updatedAt -__v")
      .populate({
        path: "passenger",
        select: "profile email phoneNumber",
        populate: {
          path: "profile",
          select: "firstName lastName avatar rating",
        },
      })
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
      .select("-ride -driver -updatedAt -__v")
      .populate({
        path: "passenger",
        select: "profile email phoneNumber",
        populate: {
          path: "profile",
          select: "firstName lastName avatar rating",
        },
      })
      .sort({ createdAt: -1 });
  }
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Booking not found" };
    }

    if (
      booking.driver.toString() !== userId &&
      booking.passenger.toString() !== userId
    ) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized to cancel this booking",
      };
    }

    // Allow cancellation for PENDING or CONFIRMED bookings
    if (
      ![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(
        booking.status as BookingStatus
      )
    ) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Booking cannot be cancelled in its current status",
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Ride for this booking not found",
      };
    }

    const newStatus =
      booking.passenger.toString() === userId
        ? BookingStatus.CANCELLED
        : BookingStatus.DECLINED;

    booking.status = newStatus;
    await booking.save();

    const passengerEntry = rideDoc.passengers.find(
      (p) => p.user.toString() === booking.passenger.toString()
    );

    if (passengerEntry) {
      passengerEntry.status = newStatus;
      await rideDoc.save();
    }

    if (newStatus === BookingStatus.CANCELLED) {
      await notificationService.createNotification(
        booking.driver.toString(),
        NotificationType.BOOKING_CANCELLED,
        "Booking Cancelled",
        "A passenger has cancelled their booking.",
        { bookingId: booking._id, rideId: booking.ride }
      );
    } else if (newStatus === BookingStatus.DECLINED) {
      await notificationService.createNotification(
        booking.passenger.toString(),
        NotificationType.BOOKING_DECLINED,
        "Booking Removed",
        "The driver has removed your booking.",
        { bookingId: booking._id, rideId: booking.ride }
      );
    }

    return { status: booking.status };
  }
}

export const bookingService = new BookingService();
