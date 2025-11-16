import type { BadgeVariant } from "@/components/ui/badge";
import { RideStatus } from "@/types/rides.types";
import { BookingStatus } from "@/types/booking.types";

export const getStatusVariant = (status: RideStatus | BookingStatus) => {
  const colors: Record<RideStatus | BookingStatus, BadgeVariant> = {
    [RideStatus.ACTIVE]: "secondary",
    [RideStatus.COMPLETED]: "success",
    [BookingStatus.PENDING]: "secondary",
    [BookingStatus.CONFIRMED]: "success",
    [RideStatus.CANCELLED]: "destructive",
  };
  return colors[status] || "outline";
};

export const getStatusLabel = (status: RideStatus | BookingStatus): string => {
  const labels = {
    [RideStatus.ACTIVE]: "Pending",
    [RideStatus.COMPLETED]: "Completed",
    [BookingStatus.PENDING]: "Pending",
    [BookingStatus.CONFIRMED]: "Confirmed",
    [RideStatus.CANCELLED]: "Cancelled",
  };
  return labels[status] || status;
};
