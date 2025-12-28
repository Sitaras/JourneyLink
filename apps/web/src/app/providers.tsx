"use client";
import { useState, ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LinguiClientProvider } from "@/components/LinguiProvider";
import { Messages } from "@lingui/core";

export default function Providers({
  children,
  initialHasToken,
  initialLocale,
  initialMessages,
}: {
  children: ReactNode;
  initialHasToken: boolean;
  initialLocale: string;
  initialMessages: Messages;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1 * 60 * 1000,
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
    <QueryClientProvider client={queryClient}>
      <LinguiClientProvider
        initialLocale={initialLocale}
        initialMessages={initialMessages}
      >
        <AuthProvider initialHasToken={initialHasToken}>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </LinguiClientProvider>
    </QueryClientProvider>
  );
}
