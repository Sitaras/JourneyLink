import { useMutation } from "@tanstack/react-query";
import { createRide, updateRide } from "@/api-actions/ride";
import { toast } from "sonner";
import { t } from "@lingui/core/macro";
import { parseActionError } from "@/utils/errorUtils";

export const useCreateRideMutation = () => {
  return useMutation({
    mutationFn: createRide,
    onSuccess: () => {
      toast.success(t`Ride created successfully!`, {
        description: t`Your ride is now available for passengers to book.`,
      });
    },
    onError: (err: string) => {
      toast.error(t`Failed to create ride`, {
        description: parseActionError(err),
      });
    },
  });
};

export const useUpdateRideMutation = (
  rideId: string,
  onSuccess?: () => void
) => {
  return useMutation({
    mutationFn: async (data: any) => updateRide(rideId, data),
    onSuccess: () => {
      toast.success(t`Ride updated successfully`, {
        description: t`Your changes have been saved.`,
      });
      onSuccess?.();
    },
    onError: (error: string) => {
      toast.error(t`Failed to update ride`, {
        description: parseActionError(error) || t`Please try again later.`,
      });
    },
  });
};
