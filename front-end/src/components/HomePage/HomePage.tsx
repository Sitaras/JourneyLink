"use client";

import SearchRoutesForm from "@/components/SearchRoutesForm/SearchRoutesForm";
import { useSearchRoutes } from "@/hooks/useSearchRoutes";
import RoutesList from "../RoutesList/RoutesList";
import useCityAutocomplete from "@/hooks/useCityAutocomplete";
import { parseDateFlexible } from "@/utils/dateUtils";
import PaginationBar from "../PaginationBar/PaginationBar";
import { useRouteSearchParams } from "@/hooks/useRouteSearchParams";

export default function HomePage() {
  const [{ from, to, departureDate }] = useRouteSearchParams();

  const { data: originData, isLoading: isLoadingFrom } =
    useCityAutocomplete(from);

  const { data: destinationData, isLoading: isLoadingTo } = useCityAutocomplete(
    !isLoadingFrom ? to : ""
  );

  const defaultOriginData = originData?.[0];
  const defaultDestinationData = destinationData?.[0];

  const departureLocation = defaultOriginData
    ? {
        label: `${defaultOriginData.name}, ${defaultOriginData.county}`,
        name: defaultOriginData.name,
        lat: defaultOriginData.lat,
        lng: defaultOriginData.lng,
        coordinates: defaultOriginData.coordinates,
      }
    : undefined;

  const arrivalLocation = defaultDestinationData
    ? {
        label: `${defaultDestinationData.name}, ${defaultDestinationData.county}`,
        name: defaultDestinationData.name,
        lat: defaultDestinationData.lat,
        lng: defaultDestinationData.lng,
        coordinates: defaultDestinationData.coordinates,
      }
    : undefined;

  const dateTrip = parseDateFlexible(departureDate) || undefined;

  const payload =
    departureLocation && arrivalLocation && dateTrip
      ? {
          originLat: departureLocation.lat.toString(),
          originLng: departureLocation.lng.toString(),
          destinationLat: arrivalLocation.lat.toString(),
          destinationLng: arrivalLocation.lng.toString(),
          departureDate: dateTrip.toISOString(),
        }
      : undefined;

  const {
    pageData,
    page,
    totalPages,
    isLoading: isLoadingRoutes,
    handlePrevious,
    handleNext,
  } = useSearchRoutes(payload);

  const isLoading = isLoadingFrom || isLoadingTo || isLoadingRoutes;


  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <SearchRoutesForm
        values={{ departureLocation, arrivalLocation, dateTrip }}
        isLoading={isLoading}
        className="max-lg:max-w-3xl"
      />
      <RoutesList
        isLoading={isLoading}
        routes={pageData}
        className="max-w-3xl"
      />
      {pageData && pageData.length > 0 && (
        <PaginationBar
          currentPage={page}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
