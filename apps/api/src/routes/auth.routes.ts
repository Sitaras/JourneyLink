import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import { loginSchema, registerSchema } from "@journey-link/shared";
import { refreshTokenSchema } from "../schemas/auth/refreshTokenSchema";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validateData(registerSchema), authController.register);
router.post("/login", validateData(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validateData(refreshTokenSchema),
  authController.refreshToken
);
router.post(
  "/logout",
  authenticateToken,
  validateData(refreshTokenSchema),
  authController.logout
);
router.post("/logout-all", authenticateToken, authController.logoutAll);

export default router;
