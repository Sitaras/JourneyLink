import { createContext, useContext, useMemo } from "react";
import { IUser } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api-actions/user";

interface AuthContextType {
  user?: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: unknown;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  hasAccessToken,
  children,
}: {
  hasAccessToken: boolean;
  children: React.ReactNode;
}) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<unknown, unknown, IUser>({
    queryKey: ["api/user"],
    queryFn: getUserInfo,
    enabled: hasAccessToken,

    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(hasAccessToken),
      isLoading,
      error,
    }),
    [user, hasAccessToken, isLoading, error]
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
