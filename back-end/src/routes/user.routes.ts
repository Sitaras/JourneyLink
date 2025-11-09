import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { validateData } from "../middleware/validationMiddleware";
import { updateProfileSchema } from "../schemas/user/userProfileSchema";
import { mongoIdSchema } from "../schemas/idSchema";
import { getUserRidesQuerySchema } from "../schemas/user/userRideSchema";

const router = Router();

router.use(authenticateToken);

/**
 * @route   GET /api/me/user-info
 * @desc    Get basic user info
 */
router.get("/user-info", UserController.getUserInfo);

/**
 * @route   GET /api/me/profile
 * @desc    Get user profile
 */
router.get("/profile", UserController.getProfile);

/**
 * @route   PATCH /api/me/profile
 * @desc    Update user profile
 */
router.patch(
  "/profile",
  validateData(updateProfileSchema),
  UserController.updateProfile
);

/**
 * @route   GET /api/me/user-rides
 * @desc    Get all routes for current user as driver or passenger (query param 'type'); requires authentication
 */
router.get(
  "/user-rides",
  validateData(getUserRidesQuerySchema, "query"),
  UserController.getRides
);

/**
 * @route   GET /api/me/user-ride/:id
 * @desc    Get single ride by ID for current user
 */
router.get(
  "/user-ride/:id",
  validateData(mongoIdSchema, "params"),
  UserController.getRideById
);

export const userRoutes = router;
