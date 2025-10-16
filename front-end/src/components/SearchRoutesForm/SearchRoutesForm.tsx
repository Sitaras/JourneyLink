"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { routeSearchSchema } from "@/schemas/home/routeSearchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

type RouteSearchFormValues = z.infer<typeof routeSearchSchema>;

interface SearchRoutesFormProps {
  values?: RouteSearchFormValues;
  isLoading?: boolean;
  className?: string;
  serviceError?: string;
}

export default function SearchRoutesForm({
  values,
  isLoading,
  className,
  serviceError,
}: SearchRoutesFormProps) {
  useEffect(() => {
    if (serviceError) {
      toast.error(serviceError);
    }
  }, [serviceError]);

  const router = useRouter();

  const { control, handleSubmit, watch } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: values || {
      departureLocation: undefined,
      arrivalLocation: undefined,
      dateTrip: undefined,
    },
  });

  const onSubmit = (data: RouteSearchFormValues) => {
    const from = data.departureLocation?.label || "";
    const to = data.arrivalLocation?.label || "";
    const departureDate = new Intl.DateTimeFormat("el").format(data.dateTrip);

    const params = new URLSearchParams({ from, to, departureDate, page: "1" });
    router.push(`/?${params.toString()}`);
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
