import SearchRoutesForm from "@/components/SearchRoutesForm/SearchRoutesForm";
import RoutesList from "../RoutesList/RoutesList";
import PaginationBar from "../PaginationBar/PaginationBar";
import { parseDateFlexible } from "@/utils/dateUtils";
import { getCityAutocomplete } from "@/lib/cityApi";
import { searchRoutes, SearchRoutesResult } from "@/lib/routesApi";
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

  let searchResult: SearchRoutesResult = {
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

    const result = await searchRoutes(payload, page, LIMIT);

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
      limit={LIMIT}
      hasResults={hasResults}
      searchForm={
        <SearchRoutesForm
          values={{ departureLocation, arrivalLocation, dateTrip }}
          serviceError={searchResult.error}
        />
      }
      searchResults={
        hasSearchParams ? (
          <RoutesList routes={searchResult.pageData} className="max-w-3xl" />
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
