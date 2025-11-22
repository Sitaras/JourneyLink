"use client";
import { createContext, useContext, useMemo } from "react";
import { IUser } from "@/types/user.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "@/api-actions/user";
import { logout as logoutAction } from "@/api-actions/auth"; // Import the server action
import { useRouter } from "next/navigation";
import { routes } from "@/configs/routes";

interface AuthContextType {
  user?: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: unknown;
  refetchUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  initialHasToken,
  children,
}: {
  initialHasToken: boolean;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const logout = async () => {
    try {
      await logoutAction();
      queryClient.clear();
      router.push(routes.home); // redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
      
      queryClient.clear();
      router.push(routes.home);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: initialHasToken && isLoading,
      error,
      refetchUser: () => refetch(),
      logout,
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
