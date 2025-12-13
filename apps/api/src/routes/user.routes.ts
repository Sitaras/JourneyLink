import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { getUserRidesQuerySchema } from "../schemas/user/userRideSchema";
import { mongoIdSchema } from "../schemas/idSchema";
import { updateProfileSchema } from "@journey-link/shared";

const router = Router();

router.get("/user-info", authenticateToken, userController.getUserInfo);
router.get("/profile", authenticateToken, userController.getProfile);
router.patch(
  "/profile",
  authenticateToken,
  validateData(updateProfileSchema),
  userController.updateProfile
);
router.get(
  "/user-rides",
  authenticateToken,
  validateData(getUserRidesQuerySchema, "query"),
  userController.getRides
);
router.get(
  "/rides/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  userController.getRideById
);

export default router;
