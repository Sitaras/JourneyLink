import { RequestHandler, Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { RideController } from "../controllers/ride.controller";
import { BookingController } from "../controllers/booking.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  createRideSchema,
  deleteRideSchema,
  getRideQuerySchema,
} from "../schemas/rideSchema";
import { mongoIdSchema } from "../schemas/idSchema";

const router = Router();

/**
 * @route   POST /api/ride
 * @desc    Create new ride
 * @access  Private (requires authentication)
 */
router.post(
  "/",
  authenticateToken,
  validateData(createRideSchema),
  RideController.createRide
);

/**
 * @route   DELETE /api/ride/:id
 * @desc    Cancel/delete ride
 * @access  Private (requires authentication + ownership)
 */
router.delete(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(deleteRideSchema, "body"),
  RideController.deleteRide
);

/**
 * @route   GET /api/ride/all
 * @desc    Get all rides
 * @access  Public
 */
router.get(
  "/all",
  validateData(getRideQuerySchema, "query"),
  RideController.getRide as unknown as RequestHandler
);

/**
 * @route   GET /api/ride/:id
 * @desc    Get single ride by ID
 * @access  Private (requires authentication)
 */
router.get(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  RideController.getRideById as unknown as RequestHandler
);

/**
 * @route   PUT /api/ride/:id
 * @desc    Update ride
 * @access  Private (requires authentication + ownership)
 */
// router.put(
//   "/:id",
//   updateRide
// );

router.get(
  "/pending-bookings/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  BookingController.getPendingBookings
);

router.get(
  "/bookings/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  BookingController.getRideBookings
);

export const rideRoutes = router;
