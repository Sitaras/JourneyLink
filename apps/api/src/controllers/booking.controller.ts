import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { ICreateBookingPayload } from "@journey-link/shared";
import { MongoIdParam } from "../schemas/idSchema";
import { BookingService, bookingService } from "../services/booking.service";

export class BookingController {
  constructor(private bookingService: BookingService) {}

  createBooking = async (
    req: AuthRequest<unknown, unknown, ICreateBookingPayload>,
    res: Response,
    next: any
  ) => {
    try {
      const passengerId = req.user?.userId;
      const result = await this.bookingService.createBooking(
        passengerId!,
        req.body
      );

      return res.success(
        result,
        "Booking created successfully.",
        StatusCodes.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  acceptBooking = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.bookingService.acceptBooking(id, userId!);

      return res.success(
        result,
        "Booking accepted successfully.",
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  };

  declineBooking = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.bookingService.declineBooking(id, userId!);

      return res.success(
        result,
        "Booking declined successfully.",
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getRideBookings = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: any
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;
      const result = await this.bookingService.getRideBookings(
        rideId,
        driverId!
      );

      res.success(result, "Bookings fetched successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getPendingBookings = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: any
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;
      const result = await this.bookingService.getPendingBookings(
        rideId,
        driverId!
      );

      res.success(
        result,
        "Pending bookings fetched successfully",
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  };
}

export const bookingController = new BookingController(bookingService);
