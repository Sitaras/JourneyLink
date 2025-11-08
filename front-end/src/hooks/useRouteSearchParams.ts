import {  parseAsString, useQueryStates } from "nuqs";

export function useRideSearchParams() {
  return useQueryStates({
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    departureDate: parseAsString.withDefault(""),
  });
}
