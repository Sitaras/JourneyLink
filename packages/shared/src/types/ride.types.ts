import { BookingStatus } from "./booking.types";

// Ride status
export enum RideStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Coordinates type
export type Coordinates = [number, number]; // [longitude, latitude]

// Location type
export type Location = {
  city: string;
  address: string;
  coordinates: Coordinates;
};

// Vehicle info
export interface VehicleInfo {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  year?: number;
}

// Ride preferences
export interface RidePreferences {
  smokingAllowed: boolean;
  petsAllowed: boolean;
}

// Driver info
export interface Driver {
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: {
    average: number;
    count: number;
  };
}

// Ride type for search results
export interface Ride {
  _id: string;
  driverProfile: Driver;
  origin: Location;
  destination: Location;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  vehicleInfo: VehicleInfo;
  preferences: RidePreferences;
  additionalInfo: string;
  createdAt: string;
  originDistance: number;
  remainingSeats: number;
}

// Ride search response
export interface RideSearchResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Ride[];
}

// Ride creation response
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

// User ride type
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
}

// User rides response
export interface UserRidesResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: UserRide[];
}
