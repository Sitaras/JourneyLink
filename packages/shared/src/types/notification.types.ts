export enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_ACCEPTED = "BOOKING_ACCEPTED",
  BOOKING_DECLINED = "BOOKING_DECLINED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  RIDE_CANCELLED = "RIDE_CANCELLED",
  RIDE_UPDATED = "RIDE_UPDATED",
}

export interface INotification {
  _id: string;
  user: string; // Recipient
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // Flexible payload
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
