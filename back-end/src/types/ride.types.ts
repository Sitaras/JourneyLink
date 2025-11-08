import { Types, Document } from "mongoose";

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
      status: "pending" | "confirmed" | "cancelled";
    }
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
  status: "active" | "cancelled" | "completed";
  cancellationReason?: string;
  cancelledAt?: Date;
}
