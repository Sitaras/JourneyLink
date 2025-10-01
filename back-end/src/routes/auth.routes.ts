import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { limiter } from "../middleware/limiter.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { registerSchema } from "../schemas/auth/registerSchema";
import { loginSchema } from "../schemas/auth/loginSchema";
import { authenticateToken } from "../middleware/auth.middleware";
// import multer from "multer";

const router = Router();

router.post("/login", validateData(loginSchema), limiter, AuthController.login);
router.post("/register", validateData(registerSchema), AuthController.register);
router.post("/refresh-token", limiter, AuthController.refreshToken);

// Protected routes
router.get("/userInfo", authenticateToken, AuthController.getUserInfo);

export const authRoutes = router;
