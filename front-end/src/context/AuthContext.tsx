import { createContext, useContext, useMemo } from "react";
import { IUser } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api-actions/user";

interface AuthContextType {
  user: IUser | any;
  isLoading: boolean;
  error: any;
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
  } = useQuery({
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
    () => ({ user, isLoading, error }),
    [user, isLoading, error]
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
