import { Response, NextFunction } from "express";
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
    next: NextFunction
  ) => {
    try {
      const passengerId = req.user?.userId;
      const createdBooking = await this.bookingService.createBooking(
        passengerId!,
        req.body
      );

      return res.success(
        createdBooking,
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
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const acceptedBooking = await this.bookingService.acceptBooking(id, userId!);

      return res.success(
        acceptedBooking,
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
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const declinedBooking = await this.bookingService.declineBooking(id, userId!);

      return res.success(
        declinedBooking,
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;
      const rideBookings = await this.bookingService.getRideBookings(
        rideId,
        driverId!
      );

      res.success(rideBookings, "Bookings fetched successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getPendingBookings = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rideId = req.params?.id;
      const driverId = req.user?.userId;
      const pendingBookings = await this.bookingService.getPendingBookings(
        rideId,
        driverId!
      );

      res.success(
        pendingBookings,
        "Pending bookings fetched successfully",
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  };
  cancelBooking = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const cancelledBooking = await this.bookingService.cancelBooking(id, userId!);

      return res.success(
        cancelledBooking,
        "Booking cancelled successfully.",
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  };
}

export const bookingController = new BookingController(bookingService);
