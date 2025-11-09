import { Response } from "express";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { isUserInRide } from "../utils/rideUtils";
import { StatusCodes } from "http-status-codes";
import { ICreateBookingPayload } from "@/schemas/bookingSchema";

export class BookingController {
  static async createBooking(
    req: AuthRequest<{}, {}, ICreateBookingPayload>,
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
        status: "pending",
      });
      await rideDoc.save();

      const booking = await Booking.create({
        passenger: passengerId,
        driver: rideDoc.driver,
        ride: rideId,
        status: "pending",
      });

      return res.success(
        { status: booking.status },
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
}
