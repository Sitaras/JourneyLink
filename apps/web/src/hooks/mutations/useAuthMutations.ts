import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register } from "@/api-actions/auth";
import { parseActionError } from "@/utils/errorUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { t } from "@lingui/core/macro";

export const useLoginMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.refresh();
      toast.success(t`Welcome back!`);
    },
    onError: (err: string) => {
      toast.error(parseActionError(err));
    },
  });
};

export const useRegisterMutation = () => {
  // const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success(t`Registered successfully`);
    },
    onError: (err: string) => {
      toast.error(parseActionError(err));
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onLogoutFinally = () => {
    router.refresh();
    toast.success(t`Logged-out successfully!`);
    queryClient.clear();
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: onLogoutFinally,
    onError: onLogoutFinally,
  });
};
