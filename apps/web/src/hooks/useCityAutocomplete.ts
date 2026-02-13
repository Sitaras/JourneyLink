import { cityAutocomplete } from "@/api-actions/cityAutocomplete";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const useCityAutocomplete = (query?: string) => {
  return useQuery({
    queryKey: ["citySearch", query],
    queryFn: () => cityAutocomplete({ query: query || "" }),
    enabled: !!query && query.length > 2,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: keepPreviousData,
  });
};

export default useCityAutocomplete;
