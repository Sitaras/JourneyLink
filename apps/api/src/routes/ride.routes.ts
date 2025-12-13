import { Router, RequestHandler } from "express";
import { rideController } from "../controllers/ride.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  createRideSchema,
  updateRideSchema,
  getRideQuerySchema,
  deleteRideSchema,
} from "@journey-link/shared";
import { authenticateToken } from "../middleware/auth.middleware";
import { mongoIdSchema } from "../schemas/idSchema";

const router = Router();

router.get(
  "/all",
  validateData(getRideQuerySchema, "query"),
  rideController.getRides as unknown as RequestHandler
);

router.post(
  "/",
  authenticateToken,
  validateData(createRideSchema),
  rideController.createRide as unknown as RequestHandler
);

router.get(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  rideController.getRideById as unknown as RequestHandler
);

router.delete(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(deleteRideSchema),
  rideController.deleteRide as unknown as RequestHandler
);

router.put(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(updateRideSchema),
  rideController.updateRide as unknown as RequestHandler
);

export default router;
