import type { BadgeVariant } from "@/components/ui/badge";
import { RideStatus } from "@/types/ride.types";

export const getStatusVariant = (status: RideStatus) => {
  const colors: Record<RideStatus, BadgeVariant> = {
    pending: "secondary",
    confirmed: "success",
    completed: "success",
    rejected: "destructive",
    cancelled: "destructive",
  };
  return colors[status] || "outline";
};

export const getStatusLabel = (status: RideStatus): string => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    rejected: "Declined",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};
