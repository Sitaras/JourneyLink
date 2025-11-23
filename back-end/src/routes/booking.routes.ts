import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { BookingController } from "../controllers/booking.controller";
import { createBookingSchema } from "../schemas/bookingSchema";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  validateData(createBookingSchema),
  BookingController.createBooking
);

export const bookingRides = router;
