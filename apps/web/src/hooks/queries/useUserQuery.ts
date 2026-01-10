import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getUserInfo,
  getUserProfile,
  getUserProfileById,
  getUserRides,
} from "@/api-actions/user";
import { UserRideRole } from "@journey-link/shared";

export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: userId ? ["users", userId, "profile"] : ["/me/profile"],
    queryFn: () => (userId ? getUserProfileById(userId) : getUserProfile()),
    enabled: !!userId || userId === undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me/user-info"],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};

export const userRidesQueryOptions = (role: UserRideRole) => ({
  queryKey: ["me/user-rides", role],
  queryFn: ({ pageParam }: { pageParam: number }) =>
    getUserRides({ type: role, page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: any) => {
    return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined;
  },
});

export const useUserRidesInfinite = (role: UserRideRole) => {
  return useInfiniteQuery(userRidesQueryOptions(role));
};

export const useUserRides = (role: UserRideRole) => {
  return useQuery({
    queryKey: ["me/user-rides", role],
    queryFn: () => getUserRides({ type: role }),
  });
};
