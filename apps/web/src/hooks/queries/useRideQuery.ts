import { useQuery } from "@tanstack/react-query";
import { getRide, getPopularTrips } from "@/api-actions/ride";
import { getRideBookings } from "@/api-actions/booking";
import { BookingStatus, IBooking } from "@journey-link/shared";

export const useRide = (rideId: string) => {
  return useQuery({
    queryKey: ["api/ride", rideId],
    queryFn: () => getRide(rideId),
    enabled: !!rideId,
  });
};

export const useRideRequests = (rideId: string) => {
  return useQuery({
    queryKey: ["ride-bookings", rideId],
    queryFn: () => getRideBookings(rideId),
    enabled: !!rideId,
  });
};

export const useRidePassengers = (rideId: string) => {
  const { data: bookings, ...rest } = useQuery({
    queryKey: ["ride-bookings", rideId],
    queryFn: () => getRideBookings(rideId),
    enabled: !!rideId,
    select: (data) =>
      data.filter((b: IBooking) => b.status === BookingStatus.CONFIRMED),
  });

  return { passengers: bookings, ...rest };
};

export const usePopularTrips = (limit = 3) => {
  return useQuery({
    queryKey: ["popular-trips", limit],
    queryFn: () => getPopularTrips(limit),
  });
};
