"use client";
import { createContext, useContext, useMemo } from "react";
import { IUser } from "@journey-link/shared";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api-actions/user";

interface AuthContextType {
  user?: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: unknown;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  initialHasToken,
  children,
}: {
  initialHasToken: boolean;
  children: React.ReactNode;
}) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<unknown, unknown, IUser>({
    queryKey: ["api/user"],
    queryFn: getUserInfo,
    enabled: initialHasToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: initialHasToken && isLoading,
      error,
      refetchUser: () => refetch(),
    }),
    [user, initialHasToken, isLoading, error, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
