import {  parseAsString, useQueryStates } from "nuqs";

export function useRouteSearchParams() {
  return useQueryStates({
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    departureDate: parseAsString.withDefault(""),
  });
}
