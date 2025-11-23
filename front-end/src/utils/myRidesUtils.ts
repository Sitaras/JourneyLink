import type { BadgeVariant } from "@/components/ui/badge";
import { RideStatus } from "@/types/rides.types";

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
    [RideStatus.ACTIVE]: "Pending",
    [RideStatus.COMPLETED]: "Completed",
    [RideStatus.CANCELLED]: "Cancelled",
  };
  return labels[status] || status;
};
