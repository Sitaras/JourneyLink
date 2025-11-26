import { Types, Document } from "mongoose";
import { BookingStatus, RideStatus } from "@journey-link/shared";

// Mongoose Document interface for Ride
export interface IRide extends Document {
  driver: Types.ObjectId;
  origin: {
    city: string;
    address: string;
    coordinates: number[];
  };
  destination: {
    city: string;
    address: string;
    coordinates: number[];
  };
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  passengers: [
    {
      user: Types.ObjectId;
      seatsBooked: number;
      status: BookingStatus;
    },
  ];
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  preferences?: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
  };
  additionalInfo: string;
  status: RideStatus;
  cancellationReason?: string;
  cancelledAt?: Date;
}
