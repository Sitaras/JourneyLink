export interface RideSearchResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Ride[];
}

export interface Ride {
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
}

export interface Location {
  city: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export type RideCreationResponse = {
  id: string;
  origin: {
    city: string;
    address?: string;
    coordinates: [number, number];
  };
  destination: {
    city: string;
    address?: string;
    coordinates: [number, number];
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
