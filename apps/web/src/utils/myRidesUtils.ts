import type { BadgeVariant } from "@/components/ui/badge";
import { RideStatus, BookingStatus } from "@journey-link/shared";

export const getRideStatusVariant = (status: RideStatus) => {
  const colors: Record<RideStatus, BadgeVariant> = {
    [RideStatus.ACTIVE]: "secondary",
    [RideStatus.COMPLETED]: "success",
    [RideStatus.CANCELLED]: "destructive",
  };
  return colors[status] || "outline";
};

export const getRideStatusLabel = (status: RideStatus): string => {
  const labels = {
    [RideStatus.ACTIVE]: "Active",
    [RideStatus.COMPLETED]: "Completed",
    [RideStatus.CANCELLED]: "Cancelled",
  };
  return labels[status] || status;
};

export const getBookingStatusVariant = (status: BookingStatus) => {
  const colors: Record<BookingStatus, BadgeVariant> = {
    [BookingStatus.PENDING]: "secondary",
    [BookingStatus.CONFIRMED]: "success",
    [BookingStatus.CANCELLED]: "destructive",
    [BookingStatus.DECLINED]: "destructive",
  };
  return colors[status] || "outline";
};

export const getBookingStatusLabel = (status: BookingStatus): string => {
  const labels = {
    [BookingStatus.PENDING]: "Pending",
    [BookingStatus.CONFIRMED]: "Confirmed",
    [BookingStatus.CANCELLED]: "Cancelled",
    [BookingStatus.DECLINED]: "Declined",
  };
  return labels[status] || status;
};
