import React, { useState } from "react";
import { CustomAutocomplete } from "./CustomAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { cityAutocomplete } from "@/api-actions/cityAutocomplete";
import { CustomAutocompleteProps } from "./CustomAutocomplete";

const CityAutoComplete = ({
  ...rest
}: Omit<
  CustomAutocompleteProps,
  "options" | "onSearchChange" | "optionsKeyName"
>) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce<string>(searchInput, 300) || "";

  const { data: citiesData, isLoading } = useQuery({
    queryKey: ["citySearch", debouncedSearchInput],
    queryFn: () => cityAutocomplete({ query: debouncedSearchInput }),

    enabled: debouncedSearchInput.length > 2,

    staleTime: Infinity,
    gcTime: Infinity,
  });

  const options =
    citiesData?.map((cityInfo) => ({
      label: `${cityInfo.name}, ${cityInfo.county}`,
      value: {
        label: `${cityInfo.name}, ${cityInfo.county}`,
        name: cityInfo.name,
        lat: cityInfo.lat,
        lng: cityInfo.lng,
        coordinates: cityInfo.coordinates,
      },
    })) || [];

  return (
    <CustomAutocomplete
      options={options}
      onSearchChange={setSearchInput}
      emptyMessage={
        isLoading
          ? "Loading..."
          : searchInput.length <= 2
          ? "Type at least 3 characters to search"
          : "No cities found"
      }
      optionsKeyName="coordinates"
      {...rest}
    />
  );
};

export default CityAutoComplete;
