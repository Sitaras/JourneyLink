import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validationMiddleware";
import { mongoIdSchema } from "../schemas/idSchema";

const router = Router();

router.use(authenticateToken);

router.get("/", notificationController.getMyNotifications);

router.patch(
  "/:id/read",
  validateData(mongoIdSchema, "params"),
  notificationController.markAsRead
);

router.patch("/read-all", notificationController.markAllAsRead);

export default router;
