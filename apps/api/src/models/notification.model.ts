import { Schema, Document, model } from "mongoose";
import { INotification, NotificationType } from "@journey-link/shared";

export interface INotificationDocument
  extends Omit<INotification, "_id">, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = model<INotificationDocument>(
  "Notification",
  notificationSchema
);
