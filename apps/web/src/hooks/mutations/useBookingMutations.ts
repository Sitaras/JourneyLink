import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookSeat,
  cancelBooking,
  acceptBooking,
  declineBooking,
} from "@/api-actions/booking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserRideRole } from "@journey-link/shared";
import { parseActionError } from "@/utils/errorUtils";

export const useBookSeatMutation = (rideId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: bookSeat,
    onSuccess: async () => {
      toast.success(
        "Booking request sent! The driver will contact you shortly."
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ride-bookings", rideId] }),
        queryClient.invalidateQueries({ queryKey: ["api/ride", rideId] }),
        queryClient.invalidateQueries({ queryKey: ["me/user-rides"] }),
      ]);

      router.refresh();
    },
    onError: (err: string) => {
      toast.error(
        parseActionError(err) || "Failed to book seat. Please try again."
      );
    },
  });
};

export const useCancelBookingMutation = (rideId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      if (rideId) {
        queryClient.invalidateQueries({ queryKey: ["ride-bookings", rideId] });
        queryClient.invalidateQueries({ queryKey: ["api/ride", rideId] });
      }
      queryClient.invalidateQueries({
        queryKey: ["me/user-rides", UserRideRole.AS_PASSENGER],
      });
      // Also invalidate driver rides just in case
      queryClient.invalidateQueries({
        queryKey: ["me/user-rides", UserRideRole.AS_DRIVER],
      });
    },
    onError: (error: string) => {
      toast.error(parseActionError(error) || "Failed to cancel booking"); // Using .message or fallback as refactored api throws simpler errors or full errors depending on wretch
    },
  });
};

export const useAcceptBookingMutation = (onStatusChange?: () => void) => {
  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: () => {
      toast.success("Booking accepted");
      onStatusChange?.();
    },
    onError: (error: string) => {
      toast.error(parseActionError(error) || "Failed to accept booking");
    },
  });
};

export const useDeclineBookingMutation = (onStatusChange?: () => void) => {
  return useMutation({
    mutationFn: declineBooking,
    onSuccess: () => {
      toast.success("Booking declined");
      onStatusChange?.();
    },
    onError: (error: string) => {
      toast.error(parseActionError(error) || "Failed to decline booking");
    },
  });
};
