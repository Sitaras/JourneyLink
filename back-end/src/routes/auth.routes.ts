import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { limiter } from "../middleware/limiter.middleware";
// import multer from "multer";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", limiter, AuthController.login);
router.post("/refresh-token", limiter, AuthController.refreshToken);

// Protected routes
// router.get("/profile", authenticateToken, AuthController.getProfile);

export const authRoutes = router;
