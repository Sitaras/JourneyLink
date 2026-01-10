import { isServer, QueryClient } from "@tanstack/react-query";
import { cache } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: any) => {
          // Don't retry on 404 or 401 errors
          if (error?.status === 404 || error?.status === 401) {
            return false;
          }
          // Only retry up to 2 times
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = cache(() => {
  if (isServer) {
    // Server: always make a new query client (cached per request)
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
});
