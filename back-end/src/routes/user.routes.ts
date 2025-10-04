import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.use(authenticateToken);

router.get("/user-info", UserController.getUserInfo);

export const userRoutes = router;
