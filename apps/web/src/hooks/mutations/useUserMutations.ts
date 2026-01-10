import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api-actions/user";
import { toast } from "sonner";
import { t } from "@lingui/core/macro";
import { parseActionError } from "@/utils/errorUtils";

export const useUpdateProfileMutation = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success(t`Profile updated successfully`, {
        description: t`Your changes have been saved.`,
      });
      onSuccess?.();
    },
    onError: (err: string) => {
      toast.error(t`Failed to update profile`, {
        description: parseActionError(err) || t`Please try again later.`,
      });
    },
  });
};
