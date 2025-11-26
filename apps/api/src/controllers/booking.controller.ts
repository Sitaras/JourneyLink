import { Response } from "express";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { isUserInRide } from "../utils/rideUtils";
import { StatusCodes } from "http-status-codes";
import { ICreateBookingPayload } from "../schemas/bookingSchema";
import { BookingStatus } from "@journey-link/shared";
import { MongoIdParam } from "../schemas/idSchema";

export class BookingController {
  static async createBooking(
    req: AuthRequest<unknown, unknown, ICreateBookingPayload>,
    res: Response
  ) {
    try {
      const { rideId } = req.body;
      const passengerId = req.user?.userId;

      if (!Types.ObjectId.isValid(rideId)) {
        return res.error("Invalid Ride ID", StatusCodes.BAD_REQUEST);
      }

      const rideDoc = await Ride.findById(rideId);
      if (!rideDoc) {
        return res.error("Ride not found", StatusCodes.NOT_FOUND);
      }

      if (!rideDoc.isBookable()) {
        return res.error(
          "Ride is not available for booking.",
          StatusCodes.BAD_REQUEST
        );
      }

      if (rideDoc.driver.toString() === passengerId) {
        return res.error(
          "Driver cannot book their own ride.",
          StatusCodes.BAD_REQUEST
        );
      }

      if (await isUserInRide(passengerId!, rideId)) {
        return res.error(
          "User already in ride or has pending booking.",
          StatusCodes.BAD_REQUEST
        );
      }

      rideDoc.passengers.push({
        user: new Types.ObjectId(passengerId),
        seatsBooked: 1,
        status: BookingStatus.PENDING,
      });
      await rideDoc.save();

      const booking = await Booking.create({
        passenger: passengerId,
        driver: rideDoc.driver,
        ride: rideId,
        status: BookingStatus.PENDING,
      });

      return res.success(
        {
          bookingId: booking._id,
          status: booking.status,
        },
        "Booking created successfully.",
        StatusCodes.CREATED
      );
    } catch (error) {
      return res.error(
        "Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  static acceptBooking = async (
    req: AuthRequest<MongoIdParam>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const booking = await Booking.findById(id);

      if (!booking) {
        return res.error("Booking not found", StatusCodes.NOT_FOUND);
      }

      if (booking.driver.toString() !== userId) {
        return res.error(
          "Unauthorized to accept this booking",
          StatusCodes.UNAUTHORIZED
        );
      }

      if (booking.status !== BookingStatus.PENDING) {
        return res.error(
          "Booking cannot be accepted not in Pending Status",
          StatusCodes.BAD_REQUEST
        );
      }

      const rideDoc = await Ride.findById(booking.ride);
      if (!rideDoc) {
        return res.error(
          "Ride for this booking not found",
          StatusCodes.NOT_FOUND
        );
      }

      if (!rideDoc.isBookable()) {
        return res.error("Ride is not Bookable.", StatusCodes.BAD_REQUEST);
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

      return res.success(
        { status: booking.status },
        "Booking accepted successfully.",
        StatusCodes.OK
      );
    } catch (error) {
      return res.error(
        "Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  };

  static declineBooking = async (
    req: AuthRequest<MongoIdParam>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const booking = await Booking.findById(id);

      if (!booking) {
        return res.error("Booking not found", StatusCodes.NOT_FOUND);
      }

      if (booking.driver.toString() !== userId) {
        return res.error(
          "Unauthorized to decline this booking",
          StatusCodes.UNAUTHORIZED
        );
      }

      if (booking.status !== BookingStatus.PENDING) {
        return res.error(
          "Booking cannot be declined, not in Pending Status",
          StatusCodes.BAD_REQUEST
        );
      }

      const rideDoc = await Ride.findById(booking.ride);
      if (!rideDoc) {
        return res.error(
          "Ride for this booking not found",
          StatusCodes.NOT_FOUND
        );
      }

      if (!rideDoc.isBookable()) {
        return res.error("Ride is not Bookable.", StatusCodes.BAD_REQUEST);
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

      return res.success(
        { status: booking.status },
        "Booking declined successfully.",
        StatusCodes.OK
      );
    } catch (error) {
      return res.error(
        "Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  };

  static getRideBookings = async (
    req: AuthRequest<MongoIdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;

      if (!Types.ObjectId.isValid(rideId)) {
        res.error("Invalid Ride ID", StatusCodes.BAD_REQUEST);
        return;
      }

      const rideDoc = await Ride.findById(rideId);
      if (!rideDoc) {
        res.error("Ride not found", StatusCodes.NOT_FOUND);
        return;
      }

      if (rideDoc.driver.toString() !== driverId) {
        res.error(
          "Not authorized to view bookings for this ride",
          StatusCodes.FORBIDDEN
        );
        return;
      }

      // Fetch all bookings for this ride
      const bookings = await Booking.find({ ride: rideId })
        .populate("passenger", "profile email phoneNumber")
        .populate("ride", "origin destination departureTime pricePerSeat")
        .sort({ createdAt: -1 });

      res.success(bookings, "Bookings fetched successfully", StatusCodes.OK);
    } catch (error) {
      console.error("Get ride bookings error:", error);
      res.error("Server Error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  };

  static getPendingBookings = async (
    req: AuthRequest<MongoIdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;

      if (!Types.ObjectId.isValid(rideId)) {
        res.error("Invalid Ride ID", StatusCodes.BAD_REQUEST);
        return;
      }

      const rideDoc = await Ride.findById(rideId);
      if (!rideDoc) {
        res.error("Ride not found", StatusCodes.NOT_FOUND);
        return;
      }

      if (rideDoc.driver.toString() !== driverId) {
        res.error(
          "Not authorized to view bookings for this ride",
          StatusCodes.FORBIDDEN
        );
        return;
      }

      const bookings = await Booking.find({
        ride: rideId,
        status: BookingStatus.PENDING,
      })
        .populate("passenger", "profile email phoneNumber")
        .sort({ createdAt: -1 });

      res.success(
        bookings,
        "Pending bookings fetched successfully",
        StatusCodes.OK
      );
    } catch (error) {
      console.error("Get pending bookings error:", error);
      res.error("Server Error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  };
}
