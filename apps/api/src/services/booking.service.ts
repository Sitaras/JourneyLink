import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { isUserInRide } from "../utils/rideUtils";
import {
  ICreateBookingPayload,
  BookingStatus,
  NotificationType,
  ErrorCodes,
} from "@journey-link/shared";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "./notification.service";

export class BookingService {
  async createBooking(userId: string, data: ICreateBookingPayload) {
    const { rideId } = data;

    if (!Types.ObjectId.isValid(rideId)) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.INVALID_RIDE_ID,
      };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.RIDE_NOT_AVAILABLE,
      };
    }

    if (rideDoc.driver.toString() === userId) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.DRIVER_CANNOT_BOOK_OWN_RIDE,
      };
    }

    if (await isUserInRide(userId, rideId)) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.USER_ALREADY_IN_RIDE,
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
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.BOOKING_NOT_FOUND,
      };
    }

    if (booking.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED_ACCEPT_BOOKING,
      };
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.BOOKING_NOT_PENDING_ACCEPT,
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_FOR_BOOKING_NOT_FOUND,
      };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.RIDE_NOT_BOOKABLE,
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
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.BOOKING_NOT_FOUND,
      };
    }

    if (booking.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED_DECLINE_BOOKING,
      };
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.BOOKING_NOT_PENDING_DECLINE,
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_FOR_BOOKING_NOT_FOUND,
      };
    }

    if (!rideDoc.isBookable()) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.RIDE_NOT_BOOKABLE,
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
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.INVALID_RIDE_ID,
      };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
    }

    if (rideDoc.driver.toString() !== driverId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: ErrorCodes.UNAUTHORIZED_VIEW_BOOKINGS,
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
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.INVALID_RIDE_ID,
      };
    }

    const rideDoc = await Ride.findById(rideId);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
    }

    if (rideDoc.driver.toString() !== driverId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: ErrorCodes.UNAUTHORIZED_VIEW_BOOKINGS,
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
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.BOOKING_NOT_FOUND,
      };
    }

    if (
      booking.driver.toString() !== userId &&
      booking.passenger.toString() !== userId
    ) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED_CANCEL_BOOKING,
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
        message: ErrorCodes.BOOKING_CANNOT_CANCEL,
      };
    }

    const rideDoc = await Ride.findById(booking.ride);
    if (!rideDoc) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_FOR_BOOKING_NOT_FOUND,
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
