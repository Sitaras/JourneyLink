"use client";

import { createRoute } from "@/api-actions/routes";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { createRouteSchema } from "@/schemas/home/createRouteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateRouteFormValues } from "@/schemas/home/createRouteSchema";
import { Switch } from "@/components/ui/switch";
import { ICreateRoutePayload } from "@/schemas/routesSchema";
import { combineDateAndTime } from "@/utils/dateUtils";
import { parsePrice } from "@/utils/moneysUtils";
import Typography from "@/components/ui/typography";
import { Clock8Icon } from "lucide-react";
import { SeatsSelect } from "@/components/ui/Inputs/SeatSelect";
import { CustomTextarea } from "@/components/ui/Inputs/CustomTextarea";
import { onError } from "@/utils/formUtils";

export default function CreateRoute() {
  const { register, control, handleSubmit } = useForm<CreateRouteFormValues>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      smoking: false,
      petsAllowed: false,
    },
    shouldFocusError: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: ICreateRoutePayload) => {
      return createRoute(data);
    },
    onSuccess: () => {
      toast.success("Route created successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: CreateRouteFormValues) => {
    const departureTime = combineDateAndTime(
      data.dateTrip,
      data.time
    ).toISOString();

    const body: ICreateRoutePayload = {
      origin: {
        city: data.departureLocation.name,
        coordinates: [data.departureLocation.lng, data.departureLocation.lat],
      },
      destination: {
        city: data.arrivalLocation.name,
        coordinates: [data.arrivalLocation.lng, data.arrivalLocation.lat],
      },
      departureTime,
      availableSeats: Number(data.availableSeats),
      pricePerSeat: parsePrice(data.pricePerSeat) || 0,
      preferences: {
        smokingAllowed: data.smoking,
        petsAllowed: data.petsAllowed,
      },
    };

    mutation.mutate(body);
  };

  const handleOnError = (errors: FieldErrors) => {
    const fieldLabels: Record<string, string> = {
      departureLocation: "Departure location",
      arrivalLocation: "Arrival location",
      dateTrip: "Travel Date",
      time: "Time",
      availableSeats: "Available seats",
      pricePerSeat: "Price per seat",
      smoking: "Smoking",
      petsAllowed: "Pets allowed",
      additionalInfo: "Additional info",
    };

    onError(fieldLabels, errors);
  };

  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        <div className="flex flex-col gap-1">
          <Typography variant="h2">Offer a ride</Typography>
          <Typography>
            Share your journey and split the costs. Fill in the details below to
            post your ride
          </Typography>
        </div>
        <form
          id="create-route"
          onSubmit={handleSubmit(onSubmit, handleOnError)}
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <CityAutoComplete
            control={control}
            name="departureLocation"
            label="Departure location"
            placeholder="e.g. Athens"
            buttonClassName="w-full"
          />
          <CityAutoComplete
            control={control}
            name="arrivalLocation"
            label="Arrival location"
            placeholder="e.g. Thessaloniki"
            buttonClassName="w-full"
          />
          <div className="flex gap-4 w-full">
            <DatePicker
              control={control}
              name="dateTrip"
              label="Date"
              placeholder="Select a date"
              captionLayout="dropdown"
              className="flex-1"
              buttonClassName="w-full"
            />

            <div className="relative flex-1">
              <CustomInput
                type="time"
                name="time"
                id="time-picker"
                register={register}
                label="Time (24-h format)"
                className="peer bg-background appearance-none pr-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-10 right-0 flex items-center justify-center pr-4 peer-disabled:opacity-50">
                <Clock8Icon className="size-4 z-10 opacity-50" />
                <span className="sr-only">User</span>
              </div>
            </div>
          </div>
          <SeatsSelect
            control={control}
            name="availableSeats"
            label="Available Seats"
            maxSeats={4}
            required
          />
          <CustomInput
            name="pricePerSeat"
            label="Price per seat (€)"
            register={register}
            required
          />
          <Typography className="text-sm font-medium leading-none">
            Preferences
          </Typography>
          <div className="flex gap-4">
            <Switch control={control} name="smoking" label="Smoking" />
            <Switch control={control} name="petsAllowed" label="Pets allowed" />
          </div>
          {/* replace it with text area */}
          <CustomTextarea
            name="additionalInfo"
            label="Additional info"
            placeholder="e.g. coffee stop"
            register={register}
          />
          <Button type="submit" loading={mutation.isPending}>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
