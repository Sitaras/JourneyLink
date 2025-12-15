import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { createBookingSchema } from "@journey-link/shared";
import { mongoIdSchema } from "../schemas/idSchema";

const router = Router();

router.post(
  "/",
  authenticateToken,
  validateData(createBookingSchema),
  bookingController.createBooking
);

router.post(
  "/:id/accept",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  bookingController.acceptBooking
);

router.post(
  "/:id/decline",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  bookingController.declineBooking
);

router.post(
  "/:id/cancel",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  bookingController.cancelBooking
);

router.get(
  "/ride/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  bookingController.getRideBookings
);

router.get(
  "/ride/:id/pending",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  bookingController.getPendingBookings
);

export default router;
