import type { BadgeVariant } from "@/components/ui/badge";
import { RideStatus } from "@journey-link/shared";
import { isPast } from "./dateUtils";

export const getRideStatusVariant = (status: RideStatus) => {
  const colors: Record<RideStatus, BadgeVariant> = {
    [RideStatus.ACTIVE]: "secondary",
    [RideStatus.COMPLETED]: "success",
    [RideStatus.CANCELLED]: "destructive",
  };
  return colors[status] || "outline";
};

export const getRideStatusLabel = (
  status: RideStatus,
  departureTime?: string | Date
): string => {
  if (status === RideStatus.ACTIVE && departureTime && isPast(departureTime)) {
    return "Completed";
  }

  const labels = {
    [RideStatus.ACTIVE]: "Pending",
    [RideStatus.COMPLETED]: "Completed",
    [RideStatus.CANCELLED]: "Cancelled",
  };
  return labels[status] || status;
};
