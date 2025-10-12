"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { routeSearchSchema } from "@/schemas/home/routeSearchSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { parseDateFlexible } from "@/utils/dateUtils";
import { useRouteSearchParams } from "@/hooks/useRouteSearchParams";
import { usePaginationSearchParams } from "@/hooks/usePaginationSearchParams";

type RouteSearchFormValues = z.infer<typeof routeSearchSchema>;

interface SearchRoutesFormProps {
  values?: RouteSearchFormValues;
  isLoading?: boolean;
  className?: string;
}

export default function SearchRoutesForm({
  values,
  isLoading,
  className,
}: SearchRoutesFormProps) {
  const [{ from, to, departureDate }, setSearchParams] = useRouteSearchParams();
  const [, setPagination] = usePaginationSearchParams();

  const { control, handleSubmit, watch } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: {
      departureLocation: from ? { label: from } : undefined,
      arrivalLocation: from ? { label: to } : undefined,
      dateTrip: parseDateFlexible(departureDate) || undefined,
    },
    values,
  });

  const onSubmit = (data: RouteSearchFormValues) => {
    const searchParams = {
      from: data.departureLocation?.label || "",
      to: data.arrivalLocation?.label || "",
      departureDate: new Intl.DateTimeFormat("el").format(data.dateTrip),
    };

    setSearchParams(searchParams);
    setPagination({ page: null });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex gap-4 justify-center items-center w-full flex-wrap",
        className
      )}
      noValidate
    >
      <CityAutoComplete
        control={control}
        name="departureLocation"
        label="Departure location"
        defaultSearchInput={watch("departureLocation")?.label}
        placeholder="e.g. Athens"
      />
      <CityAutoComplete
        control={control}
        name="arrivalLocation"
        label="Arrival location"
        defaultSearchInput={watch("arrivalLocation")?.label}
        placeholder="e.g. Thessaloniki"
      />
      <DatePicker
        control={control}
        name="dateTrip"
        label="Travel Date"
        placeholder="Select a date"
        captionLayout="dropdown"
      />
      <Button
        type="submit"
        className="max-lg:w-full mt-auto"
        loading={isLoading}
      >
        Search
      </Button>
    </form>
  );
}
