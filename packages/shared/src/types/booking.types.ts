export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  DECLINED = "declined",
}

export interface IBookSeatResponse {
  status: BookingStatus;
}

export interface IBooking {
  _id: string;
  passenger: {
    _id: string;
    email?: string;
    phoneNumber?: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
      rating?: {
        average: number;
        count: number;
      };
    };
  };
  driver?: string;
  ride?: string;
  status: BookingStatus;
  seats: number;
  createdAt: string;
}
