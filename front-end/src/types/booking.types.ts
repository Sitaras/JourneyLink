export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "cancelled",
}

export type IBookSeatResponse = {
  status: BookingStatus;
};
