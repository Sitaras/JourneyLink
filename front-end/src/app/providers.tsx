"use client";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
            staleTime: 1 * 60 * 1000,
            // refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 404 or 401 errors
              if (error?.status === 404 || error?.status === 401) {
                return false;
              }
              // Only retry up to 2 times
              return failureCount < 2;
            },
            // Custom retry delay: 1s for first retry, 4s for second
            retryDelay: (attemptIndex) => {
              return attemptIndex === 1 ? 1000 : 4000;
            },
          },
        },
      })
  );

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider hasAccessToken={hasAccessToken}>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
