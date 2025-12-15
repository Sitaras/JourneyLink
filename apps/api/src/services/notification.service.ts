import { Notification } from "../models/notification.model";
import { NotificationType } from "@journey-link/shared";
import { StatusCodes } from "http-status-codes";

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, any> = {}
  ) {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
    });
    return notification;
  }

  async getUserNotifications(
    userId: string,
    query: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: userId }),
    ]);

    return {
      notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Notification not found",
      };
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }
}

export const notificationService = new NotificationService();
