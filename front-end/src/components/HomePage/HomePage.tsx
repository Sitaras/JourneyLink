import SearchRidesForm from "@/components/SearchRidesForm/SearchRidesForm";
import RidesList from "../RoutesList/RidesList";
import PaginationBar from "../PaginationBar/PaginationBar";
import { parseDateFlexible } from "@/utils/dateUtils";
import { getCityAutocomplete } from "@/lib/cityApi";
import { searchRides, SearchRidesResult } from "@/lib/rideApi";
import Layout from "./Layout";

interface HomePageProps {
  searchParams: {
    from?: string;
    to?: string;
    departureDate?: string;
    page?: string;
  };
}

const LIMIT = 3;

export default async function HomePage({ searchParams }: HomePageProps) {
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const departureDate = searchParams?.departureDate || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const [originData, destinationData] = await Promise.all([
    getCityAutocomplete(from),
    getCityAutocomplete(to),
  ]);

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

  let searchResult: SearchRidesResult = {
    pageData: [],
    totalPages: 1,
    error: "",
  };

  if (departureLocation && arrivalLocation && dateTrip) {
    const payload = {
      originLat: departureLocation.lat.toString(),
      originLng: departureLocation.lng.toString(),
      destinationLat: arrivalLocation.lat.toString(),
      destinationLng: arrivalLocation.lng.toString(),
      departureDate: dateTrip.toISOString(),
    };

    const result = await searchRides(payload, page, LIMIT);

    searchResult = structuredClone(result);
  }

  const isInitialLoad = !from && !to && !departureDate;
  const hasSearchParams = departureLocation && arrivalLocation && dateTrip;
  const hasResults = searchResult.pageData && searchResult.pageData.length > 0;

  return (
    <Layout
      isInitialLoad={isInitialLoad}
      page={page}
      totalPages={searchResult.totalPages}
      limit={searchResult?.pageData?.length ?? 0}
      hasResults={hasResults}
      searchForm={
        <SearchRidesForm
          values={{ departureLocation, arrivalLocation, dateTrip }}
          serviceError={searchResult.error}
        />
      }
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
  );
}
