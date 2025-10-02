"use client";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({
  hasAccessToken,
  children,
}: {
  hasAccessToken: boolean;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 900000,
            // refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 404 or 401 errors
              if (error?.status === 404 || error?.status === 401) {
                return false;
              }
              // Only retry up to 2 times
              return failureCount < 2;
            },
            // Custom retry delay: 7s for first retry, 12s for second
            retryDelay: (attemptIndex) => {
              return attemptIndex === 1 ? 7000 : 12000;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider hasAccessToken={hasAccessToken}>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
