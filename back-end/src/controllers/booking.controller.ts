import { Response } from "express";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
// import { StatusCodes } from "http-status-codes";

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { ride } = req.body;
      const passengerId = req.user?.userId;

      if (!Types.ObjectId.isValid(ride)) {
        res.status(400).json({ message: "Invalid IDs provided." });
        return;
      }

      const rideDoc = await Ride.findById(ride);
      if (!rideDoc) {
        res.status(404).json({ message: "Ride not found." });
        return;
      }

      /**
       * Check if ride is bookable.
       */
      if (!rideDoc.isBookable()) {
        res.status(400).json({ message: "Ride is not available for booking." });
        return;
      }

      /**
       * Prevent driver booking their own ride.
       */
      if (rideDoc.driver.toString() === passengerId) {
        res.status(400).json({ message: "Driver cannot book their own ride." });
        return;
      }

      const booking = await Booking.create({
        passenger: passengerId,
        driver: rideDoc.driver,
        ride,
        status: "pending",
      });

      res.status(201).json({
        message: "Booking created successfully.",
        booking,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
}
