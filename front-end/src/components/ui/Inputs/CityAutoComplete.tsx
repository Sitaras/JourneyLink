import React, { useState } from "react";
import { CustomAutocomplete } from "./CustomAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomAutocompleteProps } from "./CustomAutocomplete";
import useCityAutocomplete from "@/hooks/useCityAutocomplete";

const CityAutoComplete = ({
  defaultSearchInput,
  ...rest
}: Omit<
  CustomAutocompleteProps,
  "options" | "onSearchChange" | "optionsKeyName"
> & { defaultSearchInput?: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput =
    useDebounce<string>(searchInput || defaultSearchInput, 300) || "";

  const { data: citiesData, isLoading } =
    useCityAutocomplete(debouncedSearchInput);

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
