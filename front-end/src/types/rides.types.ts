import { BookingStatus } from "./booking.types";

export enum RideStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
type Coordinates = [number, number]; // [longitude, latitude]

export type Location = {
  city: string;
  address: string;
  coordinates: Coordinates;
};

export type Ride = {
  _id: string;
  driverProfile: {
    firstName?: string;
    lastName: string;
    avatar?: string;
    rating: { average: string; count: string };
  };
  origin: Location;
  destination: Location;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  preferences: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
  };
  additionalInfo: string;
  createdAt: string;
  originDistance: number;
  remainingSeats: number;
};

export type RideSearchResponse = {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Ride[];
};

export type RideCreationResponse = {
  id: string;
  origin: {
    city: string;
    address?: string;
    coordinates: Coordinates;
  };
  destination: {
    city: string;
    address?: string;
    coordinates: Coordinates;
  };
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  preferences: {
    smoking: boolean;
    petsAllowed: boolean;
  };
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
};

export type Driver = {
  firstName: string;
  lastName: string;
  rating: {
    average: number;
    count: number;
  };
};

export type UserRide = {
  _id: string;
  origin: Location;
  destination: Location;
  departureTime: string;
  pricePerSeat: number;
  status: RideStatus | BookingStatus;

  availableSeats?: number;
  totalPassengersBooked?: number;
  bookingDate?: string;
  driver?: Driver;
};

export type UserRidesResponse = {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: UserRide[];
};
