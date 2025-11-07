export type RideStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "rejected"
  | "cancelled";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
}

export interface Ride {
  id: string;
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate?: Date;
  status: RideStatus;
  driver: User;
  passengers: User[];
  maxPassengers?: number;
  pricePerSeat?: number;
  distance?: number;
  duration?: string;
  vehicleModel?: string;
  notes?: string;
}
