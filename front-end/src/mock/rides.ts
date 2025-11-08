import { Ride } from "@/types/ride.types";

const PAGE_SIZE = 1;

export const fetchRides = async (
  page: number,
  type: "passenger" | "driver"
): Promise<{ rides: Ride[]; hasMore: boolean }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allRides =
    type === "passenger" ? mockRidesAsPassenger : mockRidesAsDriver;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const rides = allRides.slice(start, end);
  const hasMore = end < allRides.length;

  return { rides, hasMore };
};

export const mockRidesAsPassenger: Ride[] = [
  {
    id: "ride-1",
    origin: "Athens",
    destination: "Thessaloniki",
    departureDate: new Date("2025-11-15T09:00:00"),
    arrivalDate: new Date("2025-11-15T14:30:00"),
    status: "confirmed",
    driver: {
      id: "driver-1",
      name: "Maria Papadopoulos",
      rating: 4.8,
    },
    passengers: [
      { id: "pass-1", name: "You" },
      { id: "pass-2", name: "John Smith" },
    ],
    maxPassengers: 4,
    pricePerSeat: 25,
    distance: 502,
    duration: "5h 30m",
    vehicleModel: "Toyota Corolla",
    notes: "Highway ride, one rest stop included",
  },
  {
    id: "ride-2",
    origin: "Patras",
    destination: "Athens",
    departureDate: new Date("2025-11-08T16:00:00"),
    status: "pending",
    driver: {
      id: "driver-2",
      name: "Dimitris Nikolaou",
      rating: 4.5,
    },
    passengers: [{ id: "pass-1", name: "You" }],
    maxPassengers: 3,
    pricePerSeat: 18,
    distance: 215,
    duration: "2h 45m",
    vehicleModel: "Honda Civic",
  },
  {
    id: "ride-3",
    origin: "Athens",
    destination: "Kalamata",
    departureDate: new Date("2025-10-28T07:30:00"),
    status: "completed",
    driver: {
      id: "driver-3",
      name: "Elena Georgiou",
      rating: 5.0,
    },
    passengers: [
      { id: "pass-1", name: "You" },
      { id: "pass-3", name: "Anna Wilson" },
      { id: "pass-4", name: "Mike Johnson" },
    ],
    maxPassengers: 4,
    pricePerSeat: 22,
    distance: 238,
    duration: "3h 15m",
    vehicleModel: "Volkswagen Passat",
  },
  {
    id: "ride-4",
    origin: "Heraklion",
    destination: "Chania",
    departureDate: new Date("2025-11-20T11:00:00"),
    status: "rejected",
    driver: {
      id: "driver-4",
      name: "Nikos Apostolou",
      rating: 4.2,
    },
    passengers: [],
    maxPassengers: 3,
    pricePerSeat: 15,
    distance: 143,
    duration: "2h 10m",
    vehicleModel: "Seat Ibiza",
  },
];

export const mockRidesAsDriver: Ride[] = [
  {
    id: "ride-5",
    origin: "Mytilene",
    destination: "Athens",
    departureDate: new Date("2025-11-10T08:00:00"),
    arrivalDate: new Date("2025-11-10T20:30:00"),
    status: "confirmed",
    driver: {
      id: "you",
      name: "You",
      rating: 4.7,
    },
    passengers: [
      { id: "pass-5", name: "Sofia Martinez" },
      { id: "pass-6", name: "Alex Turner" },
    ],
    maxPassengers: 4,
    pricePerSeat: 35,
    distance: 345,
    duration: "12h 30m (with ferry)",
    vehicleModel: "BMW 3 Series",
    notes: "Ferry crossing included in price",
  },
  {
    id: "ride-6",
    origin: "Athens",
    destination: "Volos",
    departureDate: new Date("2025-11-25T14:00:00"),
    status: "pending",
    driver: {
      id: "you",
      name: "You",
      rating: 4.7,
    },
    passengers: [{ id: "pass-7", name: "Christina Lee" }],
    maxPassengers: 3,
    pricePerSeat: 20,
    distance: 326,
    duration: "4h 15m",
    vehicleModel: "BMW 3 Series",
  },
  {
    id: "ride-7",
    origin: "Athens",
    destination: "Nafplio",
    departureDate: new Date("2025-10-25T10:00:00"),
    status: "completed",
    driver: {
      id: "you",
      name: "You",
      rating: 4.7,
    },
    passengers: [
      { id: "pass-8", name: "George Brown" },
      { id: "pass-9", name: "Maria Garcia" },
    ],
    maxPassengers: 3,
    pricePerSeat: 12,
    distance: 138,
    duration: "2h 00m",
    vehicleModel: "BMW 3 Series",
  },
];
