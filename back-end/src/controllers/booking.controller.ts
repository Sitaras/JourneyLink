import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { Route } from "../models/route.model";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";

export class BookingController {

    static async createBooking(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { route } = req.body;
            const passengerId = req.user?.userId;
            
            if (!Types.ObjectId.isValid(route)) {
                res.status(400).json({ message: "Invalid IDs provided." });
                return;
            }

            const routeDoc = await Route.findById(route);
            if (!routeDoc) {
                res.status(404).json({ message: "Route not found." });
                return;
            }

            /**
             * Check if route is bookable.
             */
            if (!routeDoc.isBookable()) {
                res.status(400).json({ message: "Route is not available for booking." });
                return;
            }

            /**
             * Prevent driver booking their own route.
             */            
            if (routeDoc.driver.toString() === passengerId) {
                res.status(400).json({ message: "Driver cannot book their own route." });
                return;
            }

            const booking = await Booking.create({
                passenger: passengerId,
                driver: routeDoc.driver,
                route,
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