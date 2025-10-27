import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.use(authenticateToken);

// Get user info with profile
router.get("/user-info", UserController.getUserInfo);

router.get("/profile", UserController.getProfile);

router.put("/profile", UserController.updateProfile);


export const userRoutes = router;