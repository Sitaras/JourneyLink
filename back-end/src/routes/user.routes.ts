import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticateToken);

// Get user info with profile
router.get("/user-info", UserController.getUserInfo);

router.get("/profile", UserController.getProfile);

router.put("/profile", UserController.updateProfile);

// File upload endpoint with size validation
router.post("/upload", upload.single('file'), UserController.uploadFile);

export const userRoutes = router;