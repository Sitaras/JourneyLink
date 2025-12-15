import { BookingStatus, IBooking } from "./booking.types";

export enum RideStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type Coordinates = [number, number]; // [longitude, latitude]

export type Location = {
  city: string;
  address: string;
  coordinates: Coordinates;
};

export interface VehicleInfo {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  year?: number;
}

export interface RidePreferences {
  smokingAllowed: boolean;
  petsAllowed: boolean;
}

export interface Driver {
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: {
    average: number;
    count: number;
  };
}

export interface Ride {
  _id: string;
  driver: string;
  driverProfile: Driver;
  origin: Location;
  destination: Location;
  departureTime: string;
  status: RideStatus;
  availableSeats: number;
  pricePerSeat: number;
  vehicleInfo: VehicleInfo;
  preferences: RidePreferences;
  additionalInfo: string;
  createdAt: string;
  originDistance: number;
  remainingSeats: number;
  bookedSeats: number;
  myBooking?: IBooking;
}

export interface RideSearchResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Ride[];
}

export interface RideCreationResponse {
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
  vehicleInfo: VehicleInfo;
  preferences: {
    smoking: boolean;
    petsAllowed: boolean;
  };
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRide {
  _id: string;
  origin: Location;
  destination: Location;
  departureTime: string;
  pricePerSeat: number;
  status: RideStatus;
  availableSeats?: number;
  totalPassengersBooked?: number;
  bookingDate?: string;
  bookingStatus?: BookingStatus;
  driver?: Driver;
  vehicleInfo?: VehicleInfo;
  preferences?: RidePreferences;
  additionalInfo?: string;
}

export interface UserRidesResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: UserRide[];
}
