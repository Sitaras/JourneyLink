import { getQueryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getPopularTrips } from "@/api-actions/ride";
import SearchRidesForm from "@/components/SearchRidesForm/SearchRidesForm";
import { RideFilters } from "@/components/RideFilters/RideFilters";
import { RideSortBy, SortOrder } from "@journey-link/shared";
import RidesList from "../RoutesList/RidesList";
import PaginationBar from "../PaginationBar/PaginationBar";
import { parseDateFlexible, formatDate } from "@journey-link/shared";
import { getCityAutocomplete } from "@/lib/cityApi";
import { searchRides, SearchRidesResult } from "@/lib/rideApi";
import Layout from "./Layout";
import { DateFormats } from "@journey-link/shared";

export type HomePageProps = {
  searchParams: {
    from?: string;
    to?: string;
    originLat?: string;
    originLng?: string;
    destLat?: string;
    destLng?: string;
    departureDate?: string;
    page?: string;
    minSeats?: string;
    maxPrice?: string;
    smokingAllowed?: string;
    petsAllowed?: string;
    sortBy?: RideSortBy;
    sortOrder?: SortOrder;
  };
};

const LIMIT = 3;

export default async function HomePage({ searchParams }: HomePageProps) {
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const departureDate = searchParams?.departureDate || "";
  const page = parseInt(searchParams?.page || "1", 10);
  const minSeats = searchParams?.minSeats;
  const maxPrice = searchParams?.maxPrice;
  const smokingAllowed = searchParams?.smokingAllowed;
  const petsAllowed = searchParams?.petsAllowed;
  const sortBy = searchParams?.sortBy;
  const sortOrder = searchParams?.sortOrder;

  const originLat = searchParams?.originLat;
  const originLng = searchParams?.originLng;
  const destLat = searchParams?.destLat;
  const destLng = searchParams?.destLng;

  const [originData, destinationData] = await Promise.all([
    !originLat ? getCityAutocomplete(from) : Promise.resolve([]),
    !destLat ? getCityAutocomplete(to) : Promise.resolve([]),
  ]);

  const defaultOriginData = originData?.[0];
  const defaultDestinationData = destinationData?.[0];

  const departureLocation =
    originLat && originLng && from
      ? {
          label: from,
          name: from,
          lat: parseFloat(originLat),
          lng: parseFloat(originLng),
          coordinates: `${parseFloat(originLng)},${parseFloat(originLat)}`,
        }
      : defaultOriginData
        ? {
            label: `${defaultOriginData.name}, ${defaultOriginData.county}`,
            name: defaultOriginData.name,
            lat: defaultOriginData.lat,
            lng: defaultOriginData.lng,
            coordinates: defaultOriginData.coordinates,
          }
        : from
          ? {
              label: from,
              name: from,
              lat: 0,
              lng: 0,
              coordinates: "0,0",
            }
          : undefined;

  const arrivalLocation =
    destLat && destLng && to
      ? {
          label: to,
          name: to,
          lat: parseFloat(destLat),
          lng: parseFloat(destLng),
          coordinates: `${parseFloat(destLng)},${parseFloat(destLat)}`,
        }
      : defaultDestinationData
        ? {
            label: `${defaultDestinationData.name}, ${defaultDestinationData.county}`,
            name: defaultDestinationData.name,
            lat: defaultDestinationData.lat,
            lng: defaultDestinationData.lng,
            coordinates: defaultDestinationData.coordinates,
          }
        : to
          ? {
              label: to,
              name: to,
              lat: 0,
              lng: 0,
              coordinates: "0,0",
            }
          : undefined;

  const dateTrip = parseDateFlexible(departureDate) || undefined;

  let searchResult: SearchRidesResult = {
    pageData: [],
    totalPages: 1,
    error: "",
  };

  const canSearch = departureLocation && arrivalLocation;

  if (canSearch) {
    const payload: any = {
      originLat: departureLocation.lat.toString(),
      originLng: departureLocation.lng.toString(),
      destinationLat: arrivalLocation.lat.toString(),
      destinationLng: arrivalLocation.lng.toString(),
      minSeats,
      maxPrice,
      smokingAllowed,
      petsAllowed,
      sortBy,
      sortOrder,
    };

    if (dateTrip) {
      payload.departureDate = dateTrip.toISOString();
    }

    const result = await searchRides(payload, page, LIMIT);
    searchResult = structuredClone(result);
  }

  const isInitialLoad = !from && !to && !departureDate;
  const hasSearchParams = canSearch;
  const hasResults = searchResult.pageData && searchResult.pageData.length > 0;

  const queryClient = getQueryClient();

  if (isInitialLoad) {
    await queryClient.prefetchQuery({
      queryKey: ["popular-trips", 3],
      queryFn: () => getPopularTrips(3),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Layout
        isInitialLoad={isInitialLoad}
        page={page}
        totalPages={searchResult.totalPages}
        limit={searchResult?.pageData?.length ?? 0}
        hasResults={hasResults}
        searchForm={
          <SearchRidesForm
            values={{
              departureLocation,
              arrivalLocation,
              dateTrip: dateTrip
                ? formatDate(dateTrip, DateFormats.DATE_DASH_REVERSE)
                : undefined,
            }}
            serviceError={searchResult.error}
          />
        }
        filters={hasSearchParams ? <RideFilters /> : null}
        searchResults={
          hasSearchParams ? (
            <RidesList rides={searchResult.pageData} className="max-w-3xl" />
          ) : null
        }
        pagination={
          hasResults ? (
            <PaginationBar
              currentPage={page}
              totalPages={searchResult.totalPages}
              from={from}
              to={to}
              departureDate={departureDate}
            />
          ) : null
        }
      />
    </HydrationBoundary>
  );
}
