"use client";
import { createContext, useContext, useMemo } from "react";
import { IUser } from "@journey-link/shared";
import { useMe } from "@/hooks/queries/useUserQuery";

interface AuthContextType {
  user?: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: unknown;
  refetchUser: () => void;
}

const AuthClientContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  initialHasToken,
  children,
}: {
  initialHasToken: boolean;
  children: React.ReactNode;
}) => {
  const { data: user, isLoading, error, refetch } = useMe();

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

  return (
    <AuthClientContext.Provider value={value}>
      {children}
    </AuthClientContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthClientContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
