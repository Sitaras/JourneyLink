import { useQuery } from "@tanstack/react-query";
import { getRide } from "@/api-actions/ride";
import { getRideBookings } from "@/api-actions/booking";

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
