import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { StatusCodes } from "http-status-codes";

class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { notifications, total, pages } =
      await notificationService.getUserNotifications((req as any).user.userId, {
        page,
        limit,
      });

    res.status(StatusCodes.OK).json({
      data: notifications,
      meta: {
        total,
        page,
        pages,
      },
    });
  }

  async markAsRead(req: Request, res: Response) {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(
      id as string,
      (req as any).user.userId
    );
    res.status(StatusCodes.OK).json({ data: notification });
  }

  async markAllAsRead(req: Request, res: Response) {
    await notificationService.markAllAsRead((req as any).user.userId);
    res
      .status(StatusCodes.OK)
      .json({ message: "All notifications marked as read" });
  }
}

export const notificationController = new NotificationController();
