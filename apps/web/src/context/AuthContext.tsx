import { ReactNode } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { authStorage } from "@/lib/authStorage";
import { AuthProvider } from "./AuthClient";

interface AuthClientProps {
  children: ReactNode;
}

async function AuthContext({ children }: AuthClientProps) {
  const queryClient = getQueryClient();
  const isLoggedIn =
    !!(await authStorage.getAccessToken()) ||
    !!(await authStorage.getRefreshToken());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider initialHasToken={isLoggedIn}>{children}</AuthProvider>
    </HydrationBoundary>
  );
}

export default AuthContext;
