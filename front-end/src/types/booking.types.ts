export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export type IBookSeatResponse = {
  status: BookingStatus;
};
