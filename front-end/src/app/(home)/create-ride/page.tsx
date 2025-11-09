"use client";

import { createRide } from "@/api-actions/ride";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { createRideSchema } from "@/schemas/home/createRideSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateRideFormValues } from "@/schemas/home/createRideSchema";
import { Switch } from "@/components/ui/switch";
import { ICreateRidePayload } from "@/schemas/rideSchema";
import { combineDateAndTime } from "@/utils/dateUtils";
import { parsePrice } from "@/utils/moneysUtils";
import Typography from "@/components/ui/typography";
import {
  Clock8Icon,
  MapPin,
  Calendar,
  Users,
  Euro,
  Settings,
  Info,
} from "lucide-react";
import { SeatsSelect } from "@/components/ui/Inputs/SeatSelect";
import { CustomTextarea } from "@/components/ui/Inputs/CustomTextarea";
import { onError } from "@/utils/formUtils";

export default function CreateRide() {
  const { register, control, handleSubmit } = useForm<CreateRideFormValues>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      smoking: false,
      petsAllowed: false,
    },
    shouldFocusError: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: ICreateRidePayload) => {
      return createRide(data);
    },
    onSuccess: () => {
      toast.success("Ride created successfully!", {
        description: "Your ride is now available for passengers to book.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create ride");
    },
  });

  const onSubmit = (data: CreateRideFormValues) => {
    const departureTime = combineDateAndTime(
      data.dateTrip,
      data.time
    ).toISOString();

    const body: ICreateRidePayload = {
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
      additionalInfo: data.additionalInfo,
    };

    mutation.mutate(body);
  };

  const handleOnError = (errors: FieldErrors) => {
    const FIELD_LABELS: Record<string, string> = {
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

    onError(FIELD_LABELS, errors);
  };

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-8 max-w-xl w-full">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Typography variant="h2">Offer a ride</Typography>
          <Typography className="text-muted-foreground text-lg">
            Share your journey and split the costs. Fill in the details below to
            post your ride.
          </Typography>
        </div>

        <form
          id="create-ride"
          onSubmit={handleSubmit(onSubmit, handleOnError)}
          className="flex flex-col gap-6 w-full"
          noValidate
        >
          {/* Ride Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  Ride Details
                </Typography>
              </div>

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
            </CardContent>
          </Card>

          {/* Date & Time Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">When?</Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  control={control}
                  name="dateTrip"
                  label="Date"
                  placeholder="Select a date"
                  captionLayout="dropdown"
                  buttonClassName="w-full"
                />

                <div className="relative">
                  <CustomInput
                    type="time"
                    name="time"
                    id="time-picker"
                    register={register}
                    label="Time (24-hour format)"
                    className="peer bg-background appearance-none pr-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-10 right-0 flex items-center justify-center pr-4 peer-disabled:opacity-50">
                    <Clock8Icon className="size-4 z-10 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seats & Price Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  Capacity & Pricing
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SeatsSelect
                  control={control}
                  name="availableSeats"
                  label="Available Seats"
                  maxSeats={4}
                  required
                />

                <div className="relative">
                  <CustomInput
                    name="pricePerSeat"
                    label="Price per seat"
                    register={register}
                    required
                    placeholder="0.00"
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-10 right-0 flex items-center justify-center pr-4">
                    <Euro className="size-4 z-10 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  Preferences
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Switch
                  control={control}
                  name="smoking"
                  label="Smoking allowed"
                />
                <Switch
                  control={control}
                  name="petsAllowed"
                  label="Pets allowed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  Additional Information
                </Typography>
              </div>

              <CustomTextarea
                name="additionalInfo"
                label="Any extra details?"
                placeholder="e.g. Planning a coffee stop, flexible departure time, luggage space available..."
                register={register}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={mutation.isPending}
            size="lg"
            className="w-full text-base font-semibold"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating ride..." : "Publish Ride"}
          </Button>

          <Typography className="text-xs text-center text-muted-foreground">
            By publishing this ride, you agree to our terms of service and
            community guidelines.
          </Typography>
        </form>
      </div>
    </section>
  );
}
