"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthClient";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import CityAutoComplete from "@/components/ui/Inputs/CityAutoComplete";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import {
  createCreateRideSchema,
  CreateRideFormValues,
} from "@/schemas/home/createRideSchema";
import { ICreateRidePayload } from "@journey-link/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRideMutation } from "@/hooks/mutations/useRideMutations";
import { FieldErrors, useForm, Resolver } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

import { combineDateAndTime } from "@journey-link/shared";
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
  Car,
} from "lucide-react";
import { SeatsSelect } from "@/components/ui/Inputs/SeatSelect";
import { CustomTextarea } from "@/components/ui/Inputs/CustomTextarea";
import { onError } from "@/utils/formUtils";

export default function CreateRide() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = user?.profile as any;
  const hasSocials =
    profile?.socials &&
    (profile.socials.facebook ||
      profile.socials.twitter ||
      profile.socials.linkedIn);

  const isProfileComplete =
    profile &&
    profile.firstName &&
    profile.lastName &&
    profile.email &&
    profile.phoneNumber &&
    profile.bio &&
    hasSocials;

  const { register, control, handleSubmit } = useForm<CreateRideFormValues>({
    resolver: zodResolver(
      useMemo(() => createCreateRideSchema(), [])
    ) as Resolver<CreateRideFormValues>,
    defaultValues: {
      smoking: false,
      petsAllowed: false,
    },
    shouldFocusError: false,
  });

  const { mutate, isPending } = useCreateRideMutation();

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
      vehicleInfo: {
        make: data.vehicleMake,
        model: data.vehicleModel,
        color: data.vehicleColor,
        licensePlate: data.vehiclePlate,
      },
      additionalInfo: data.additionalInfo,
    };

    mutate(body);
  };

  const handleOnError = (errors: FieldErrors) => {
    const FIELD_LABELS: Record<string, string> = {
      departureLocation: "Departure city",
      arrivalLocation: "Arrival city",
      dateTrip: "Travel Date",
      time: "Time",
      availableSeats: "Available seats",
      pricePerSeat: "Price per seat",
      smoking: "Smoking",
      petsAllowed: "Pets allowed",
      additionalInfo: "Additional info",
      vehicleMake: "Vehicle make",
      vehicleModel: "Vehicle model",
      vehicleColor: "Vehicle color",
      vehiclePlate: "Vehicle license plate",
    };

    onError(FIELD_LABELS, errors);
  };

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-8 max-w-xl w-full">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Typography variant="h2">
            <Trans>Offer a ride</Trans>
          </Typography>
          <Typography className="text-muted-foreground text-lg">
            <Trans>
              Share your journey and split the costs. Fill in the details below
              to post your ride.
            </Trans>
          </Typography>
        </div>

        <form
          id="create-ride"
          onSubmit={handleSubmit(onSubmit, handleOnError)}
          className="flex flex-col gap-6 w-full"
          noValidate
        >
          {!isProfileComplete && !isLoading && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm text-center">
              <Trans>
                Please complete your profile (Name, Bio, Email, Phone, Social
                Media) to publish a ride.
              </Trans>
              <span
                onClick={() => router.push("/profile")}
                className="underline cursor-pointer font-medium"
              >
                <Trans>Go to Profile</Trans>
              </span>
            </div>
          )}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  <Trans>Ride Details</Trans>
                </Typography>
              </div>

              <CityAutoComplete
                control={control}
                name="departureLocation"
                label={<Trans>Departure location</Trans>}
                placeholder={t`e.g. Athens`}
                buttonClassName="w-full"
              />

              <CityAutoComplete
                control={control}
                name="arrivalLocation"
                label={<Trans>Arrival location</Trans>}
                placeholder={t`e.g. Thessaloniki`}
                buttonClassName="w-full"
              />
            </CardContent>
          </Card>

          {/* Date & Time Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  <Trans>When?</Trans>
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  register={register}
                  name="dateTrip"
                  label={<Trans>Date</Trans>}
                  placeholder={t`Select a date`}
                  buttonClassName="w-full"
                />

                <div className="relative">
                  <CustomInput
                    type="time"
                    name="time"
                    id="time-picker"
                    register={register}
                    label={<Trans>Time (24-hour format)</Trans>}
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
                  <Trans>Capacity & Pricing</Trans>
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SeatsSelect
                  control={control}
                  name="availableSeats"
                  label={<Trans>Available Seats</Trans>}
                  maxSeats={4}
                  required
                />

                <div className="relative">
                  <CustomInput
                    name="pricePerSeat"
                    label={<Trans>Price per seat</Trans>}
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

          {/* Vehicle Info Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  <Trans>Vehicle Details</Trans>
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  name="vehicleMake"
                  label={<Trans>Make</Trans>}
                  placeholder={t`e.g. Toyota`}
                  register={register}
                  required
                />
                <CustomInput
                  name="vehicleModel"
                  label={<Trans>Model</Trans>}
                  placeholder={t`e.g. Yaris`}
                  register={register}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  name="vehicleColor"
                  label={<Trans>Color</Trans>}
                  placeholder={t`e.g. Silver`}
                  register={register}
                  required
                />
                <CustomInput
                  name="vehiclePlate"
                  label={<Trans>License Plate</Trans>}
                  placeholder={t`e.g. ABC-1234`}
                  register={register}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-primary" />
                <Typography className="font-semibold text-lg">
                  <Trans>Preferences</Trans>
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Switch
                  control={control}
                  name="smoking"
                  label={<Trans>Smoking allowed</Trans>}
                />
                <Switch
                  control={control}
                  name="petsAllowed"
                  label={<Trans>Pets allowed</Trans>}
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
                  <Trans>Additional Information</Trans>
                </Typography>
              </div>

              <CustomTextarea
                name="additionalInfo"
                label={<Trans>Any extra details?</Trans>}
                placeholder={t`e.g. Planning a coffee stop, flexible departure time, luggage space available...`}
                register={register}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isPending}
            size="lg"
            className="w-full text-base font-semibold"
            disabled={isPending || !isProfileComplete}
          >
            {isPending ? t`Creating ride...` : t`Publish Ride`}
          </Button>

          <Typography className="text-xs text-center text-muted-foreground">
            <Trans>
              By publishing this ride, you agree to our terms of service and
              community guidelines.
            </Trans>
          </Typography>
        </form>
      </div>
    </section>
  );
}
