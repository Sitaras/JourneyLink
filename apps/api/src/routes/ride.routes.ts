import { Router, RequestHandler } from "express";
import { rideController } from "../controllers/ride.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  createRideSchema,
  updateRideSchema,
  getRideQuerySchema,
  deleteRideSchema,
  popularRidesSchema,
} from "@journey-link/shared";
import { authenticateToken } from "../middleware/auth.middleware";
import { mongoIdSchema } from "../schemas/idSchema";

const router = Router();

router.get(
  "/all",
  validateData(getRideQuerySchema, "query"),
  rideController.getRides as unknown as RequestHandler
);

router.get(
  "/popular",
  validateData(popularRidesSchema, "query"),
  rideController.getPopularTrips
);

router.post(
  "/",
  authenticateToken,
  validateData(createRideSchema),
  rideController.createRide
);

router.get(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  rideController.getRideById
);

router.delete(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(deleteRideSchema),
  rideController.deleteRide
);

router.put(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(updateRideSchema),
  rideController.updateRide
);

export default router;
