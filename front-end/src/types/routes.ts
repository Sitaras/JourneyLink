export interface RouteSearchResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Route[];
}

export interface Route {
  _id: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    rating?: string;
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
    maxTwoInBack: boolean;
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
