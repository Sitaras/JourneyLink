import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotificationsFn,
  markNotificationAsReadFn,
  markAllNotificationsAsReadFn,
  IGetNotificationsResponse,
} from "../api-actions/notification";

export const useNotifications = () => {
  return useInfiniteQuery<IGetNotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      return await getNotificationsFn({ page: pageParam as number, limit: 10 });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.pages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: "always",
    refetchOnMount: true,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await markNotificationAsReadFn(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await markAllNotificationsAsReadFn();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
