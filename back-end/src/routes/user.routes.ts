import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { validateData } from "../middleware/validationMiddleware";
import { updateProfileSchema } from "../schemas/profileSchema";

const router = Router();

router.use(authenticateToken);

router.get("/user-info", UserController.getUserInfo);

router.get("/profile", UserController.getProfile);
router.patch(
  "/profile",
  validateData(updateProfileSchema),
  UserController.updateProfile
);

export const userRoutes = router;
