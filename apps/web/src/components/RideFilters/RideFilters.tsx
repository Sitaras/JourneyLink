"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RideSortBy, SortOrder } from "@journey-link/shared";
import {
  rideFiltersSchema,
  RideFiltersFormValues,
} from "@/schemas/home/rideFiltersSchema";

export function RideFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultValues: RideFiltersFormValues = useMemo(() => {
    return {
      maxPrice: searchParams.get("maxPrice") || "",
      minSeats: searchParams.get("minSeats") || "",
      smokingAllowed: searchParams.get("smokingAllowed") === "true",
      petsAllowed: searchParams.get("petsAllowed") === "true",
      sortBy:
        (searchParams.get("sortBy") as RideSortBy) || RideSortBy.DEPARTURE_TIME,
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || SortOrder.ASC,
    };
  }, [searchParams]);

  const {
    control,
    register,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<RideFiltersFormValues>({
    resolver: zodResolver(rideFiltersSchema),
    values: defaultValues,
    mode: "onChange",
  });

  const formValues = watch();

  const currentQueryString = searchParams.toString();

  const createQueryString = useCallback(
    (values: RideFiltersFormValues) => {
      const params = new URLSearchParams(currentQueryString);

      if (values.maxPrice) params.set("maxPrice", values.maxPrice);
      else params.delete("maxPrice");

      if (values.minSeats) params.set("minSeats", values.minSeats);
      else params.delete("minSeats");

      if (values.smokingAllowed) params.set("smokingAllowed", "true");
      else params.delete("smokingAllowed");

      if (values.petsAllowed) params.set("petsAllowed", "true");
      else params.delete("petsAllowed");

      if (values.sortBy) params.set("sortBy", values.sortBy);
      else params.delete("sortBy");

      if (values.sortOrder) params.set("sortOrder", values.sortOrder);
      else params.delete("sortOrder");

      params.set("page", "1");

      return params.toString();
    },
    [currentQueryString]
  );

  const newQueryString = createQueryString(formValues as RideFiltersFormValues);
  const debouncednewQueryString = useDebounce(newQueryString, 100);

  useEffect(() => {
    if (isDirty) {
      router.push(`${pathname}?${debouncednewQueryString}`, { scroll: false });
    }
  }, [debouncednewQueryString, isDirty, pathname, router]);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>
          <Trans>Filters</Trans>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div className="space-y-2">
          <Label>
            <Trans>Sort By</Trans>
          </Label>
          <Controller
            control={control}
            name="sortBy"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RideSortBy.DEPARTURE_TIME}>
                    <Trans>Departure Time</Trans>
                  </SelectItem>
                  <SelectItem value={RideSortBy.PRICE}>
                    <Trans>Price</Trans>
                  </SelectItem>
                  <SelectItem value={RideSortBy.DISTANCE}>
                    <Trans>Distance</Trans>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <div className="pt-2">
            <Controller
              control={control}
              name="sortOrder"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SortOrder.ASC}>
                      <Trans>Ascending</Trans>
                    </SelectItem>
                    <SelectItem value={SortOrder.DESC}>
                      <Trans>Descending</Trans>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice">
            <Trans>Max Price</Trans>
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder={t`Any price`}
            {...register("maxPrice")}
          />
        </div>

        {/* Min Seats */}
        <div className="space-y-2">
          <Label htmlFor="minSeats">
            <Trans>Min Seats</Trans>
          </Label>
          <Input
            id="minSeats"
            type="number"
            min="1"
            placeholder="1"
            {...register("minSeats")}
          />
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <Label>
            <Trans>Preferences</Trans>
          </Label>

          <div className="flex items-center justify-between">
            <Label htmlFor="smoking" className="font-normal">
              <Trans>Smoking Allowed</Trans>
            </Label>
            <Controller
              control={control}
              name="smokingAllowed"
              render={({ field }) => (
                <Switch
                  id="smoking"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pets" className="font-normal">
              <Trans>Pets Allowed</Trans>
            </Label>
            <Controller
              control={control}
              name="petsAllowed"
              render={({ field }) => (
                <Switch
                  id="pets"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Reset form to defaults (empty)
            const cleanValues = {
              maxPrice: "",
              minSeats: "",
              smokingAllowed: false,
              petsAllowed: false,
              sortBy: RideSortBy.DEPARTURE_TIME,
              sortOrder: SortOrder.ASC,
            };
            reset(cleanValues);
            // URL will update via effect because watched values change
          }}
        >
          <Trans>Reset Filters</Trans>
        </Button>
      </CardContent>
    </Card>
  );
}
