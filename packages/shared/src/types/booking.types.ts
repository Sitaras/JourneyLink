export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  DECLINED = "declined",
}

export interface IBookSeatResponse {
  status: BookingStatus;
}
