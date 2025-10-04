"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { routeSearchSchema } from "@/schemas/home/routeSearchSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type RouteSearchFormValues = z.infer<typeof routeSearchSchema>;

export default function HomeForm() {
  const {
    control,
    handleSubmit,
    formState: { },
  } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RouteSearchFormValues) => {},
    onSuccess: (result) => {},
    onError: () => {
      toast.error("An error occurred while searching for routes");
    },
  });

  const onSubmit = (data: RouteSearchFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 justify-center items-center w-full flex-wrap pl-10 pr-10"
      noValidate
    >
      <CityAutoComplete
        control={control}
        name="departureLocation"
        label="Departure location"
        placeholder="e.g. Athens"
      />
      <CityAutoComplete
        control={control}
        name="arrivalLocation"
        label="Arrival location"
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
        loading={mutation.isPending}
      >
        Search
      </Button>
    </form>
  );
}
