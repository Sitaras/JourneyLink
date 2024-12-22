import { Router } from "express";
// import multer from "multer";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
// const upload = multer({ dest: "uploads/" });

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// router.post("/refresh-token", AuthController.refreshToken);

// Protected routes
// router.get("/profile", authenticateToken, AuthController.getProfile);

export const authRoutes = router;
