import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { BookingController } from "../controllers/booking.controller";
import {
    createBookingSchema,
} from "../schemas/bookingSchema";


const router = Router();

router.post(
    "/create-booking",
    authenticateToken,
    validateData(createBookingSchema),
    BookingController.createBooking
);

export const bookingRides = router;
