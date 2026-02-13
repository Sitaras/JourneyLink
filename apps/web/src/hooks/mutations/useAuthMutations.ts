import { useMutation } from "@tanstack/react-query";
import { login, logout, register } from "@/api-actions/auth";
import { parseActionError } from "@/utils/errorUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { t } from "@lingui/core/macro";
import { getQueryClient } from "@/lib/queryClient";

export const useLoginMutation = () => {
  const queryClient = getQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["me/user-info"] });
      await queryClient.invalidateQueries({ queryKey: ["/me/profile"] });
      toast.success(t`Welcome back!`);
    },
    onError: (err: string) => {
      toast.error(parseActionError(err));
    },
  });
};

export const useRegisterMutation = () => {
  // const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me/user-info"] });
      await queryClient.invalidateQueries({ queryKey: ["/me/profile"] });
      toast.success(t`Registered successfully`);
    },
    onError: (err: string) => {
      toast.error(parseActionError(err));
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = getQueryClient();

  const onLogoutFinally = () => {
    toast.success(t`Logged-out successfully!`);
    queryClient.clear();
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: onLogoutFinally,
    onError: onLogoutFinally,
  });
};
