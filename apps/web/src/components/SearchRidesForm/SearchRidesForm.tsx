"use client";

import { Button } from "@/components/ui/button";
import { useForm, Resolver, FieldErrors } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { createRideSearchSchema } from "@/schemas/home/rideSearchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { shortDateFormatter } from "@/utils/formatters";
import { onError } from "@/utils/formUtils";

type RideSearchFormValues = z.infer<ReturnType<typeof createRideSearchSchema>>;

interface SearchRidesFormProps {
  values?: RideSearchFormValues;
  isLoading?: boolean;
  className?: string;
  serviceError?: string;
}

export default function SearchRidesForm({
  values,
  isLoading,
  className,
  serviceError,
}: SearchRidesFormProps) {
  const router = useRouter();

  const { control, handleSubmit, watch, register } =
    useForm<RideSearchFormValues>({
      resolver: zodResolver(
        useMemo(() => createRideSearchSchema(), [])
      ) as Resolver<RideSearchFormValues>,
      defaultValues: values || {
        departureLocation: undefined,
        arrivalLocation: undefined,
        dateTrip: undefined,
      },
    });

  useEffect(() => {
    if (serviceError) {
      toast.error(t`Search failed`, {
        description: serviceError,
      });
    }
  }, [serviceError]);

  const onSubmit = (data: RideSearchFormValues) => {
    const from = data.departureLocation?.label || "";
    const to = data.arrivalLocation?.label || "";
    const departureDate = data.dateTrip
      ? shortDateFormatter.format(new Date(data.dateTrip))
      : "";

    const params = new URLSearchParams({ from, to, departureDate, page: "1" });
    router.push(
      `/?${params.toString()}&sortBy=departureTime&sortOrder=asc&page=1`
    );
  };

  const handleOnError = (errors: FieldErrors) => {
    const FIELD_LABELS: Record<string, string> = {
      departureLocation: "Departure city",
      arrivalLocation: "Arrival city",
      dateTrip: "Travel Date",
    };

    onError(FIELD_LABELS, errors);
  };

  const departureLocation = watch("departureLocation");
  const arrivalLocation = watch("arrivalLocation");

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden hover:shadow-lg transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit, handleOnError)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden lg:block">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <CityAutoComplete
                control={control}
                name="departureLocation"
                label={<Trans>From</Trans>}
                defaultSearchInput={departureLocation?.label}
                placeholder={t`Departure city`}
                className="px-4 lg:pl-12 lg:pr-6 py-4 hover:bg-gray-50/50 transition-colors"
                buttonClassName="w-full border-0 shadow-none hover:bg-transparent focus:ring-0 px-0 h-auto text-left justify-start"
              />
            </div>

            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden lg:block">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <CityAutoComplete
                control={control}
                name="arrivalLocation"
                label={<Trans>To</Trans>}
                defaultSearchInput={arrivalLocation?.label}
                placeholder={t`Arrival city`}
                className="px-4 lg:pl-12 lg:pr-6 py-4 hover:bg-gray-50/50 transition-colors"
                buttonClassName="w-full border-0 shadow-none hover:bg-transparent focus:ring-0 px-0 h-auto text-left justify-start"
              />
            </div>

            <div className="flex items-stretch">
              <div className="group relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden lg:block">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="px-4 lg:pl-12 lg:pr-4 py-4 h-full hover:bg-gray-50/50 transition-colors">
                  <DatePicker
                    register={register}
                    name="dateTrip"
                    label={<Trans>When</Trans>}
                    placeholder={t`Select date`}
                    buttonClassName="w-full border-0 shadow-none hover:bg-transparent focus:ring-0 px-0 h-auto text-left justify-start"
                  />
                </div>
              </div>

              <div className="hidden lg:flex items-center pr-4">
                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                  className="p-4 rounded-full font-semibold gap-2 shadow-sm"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:hidden p-4 pt-0">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full h-12 rounded-lg font-semibold gap-2"
            >
              <Search className="h-5 w-5" />
              <Trans>Search Rides</Trans>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
