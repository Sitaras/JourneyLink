import SearchRoutesForm from "@/components/SearchRoutesForm/SearchRoutesForm";
import RoutesList from "../RoutesList/RoutesList";
import PaginationBar from "../PaginationBar/PaginationBar";
import { parseDateFlexible } from "@/utils/dateUtils";
import { getCityAutocomplete } from "@/lib/cityApi";
import { searchRoutes, SearchRoutesResult } from "@/lib/routesApi";

interface HomePageProps {
  searchParams: {
    from?: string;
    to?: string;
    departureDate?: string;
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const departureDate = searchParams?.departureDate || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const originData = from ? await getCityAutocomplete(from) : [];
  const destinationData =
    to && originData?.length > 0 ? await getCityAutocomplete(to) : [];

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

    const result = await searchRoutes(payload, page);

    searchResult = structuredClone(result);
  }

  return (
    <section className="flex flex-col gap-8 items-center w-full">
      <SearchRoutesForm
        values={{ departureLocation, arrivalLocation, dateTrip }}
        className="max-lg:max-w-3xl"
        serviceError={searchResult.error}
      />
      <RoutesList routes={searchResult.pageData} className="max-w-3xl" />
      {searchResult.pageData && searchResult.pageData.length > 0 && (
        <PaginationBar
          currentPage={page}
          totalPages={searchResult.totalPages}
          from={from}
          to={to}
          departureDate={departureDate}
        />
      )}
    </section>
  );
}
