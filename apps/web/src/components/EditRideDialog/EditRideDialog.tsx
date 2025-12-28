"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm, Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getRide, updateRide } from "@/api-actions/ride";
import { toast } from "sonner";
import Typography from "@/components/ui/typography";
import { DatePicker } from "../ui/datepicker";
import { CustomInput } from "../ui/Inputs/CustomInput";
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
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import { SeatsSelect } from "@/components/ui/Inputs/SeatSelect";
import { CustomTextarea } from "@/components/ui/Inputs/CustomTextarea";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { EditRideDialogSkeleton } from "./EditRideDialogSkeleton";
import { onError } from "@/utils/formUtils";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import {
  createEditRideSchema,
  EditRideFormData,
} from "@/schemas/editRideSchema";
import { useMemo } from "react";

interface EditRideDialogProps {
  rideId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRideDialog = ({
  rideId,
  open,
  onClose,
  onSuccess,
}: EditRideDialogProps) => {
  const {
    data: ride,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["api/ride", rideId],
    queryFn: () => {
      return getRide(rideId);
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EditRideFormData) => {
      if (!ride) {
        throw new Error("Ride not found");
      }

      const departureDateTime = new Date(data.dateTrip);
      const [hours, minutes] = data.departureTime.split(":");
      departureDateTime.setHours(parseInt(hours), parseInt(minutes));

      const payload = {
        ...data,
        origin: ride?.origin,
        destination: ride?.destination,
        departureTime: departureDateTime.toISOString(),
        dateTrip: undefined,
      };

      return updateRide(ride?._id, payload);
    },
    onSuccess: () => {
      toast.success(t`Ride updated successfully`, {
        description: t`Your changes have been saved.`,
      });
      onSuccess();
      refetch();
    },
    onError: (error: Error) => {
      toast.error(t`Failed to update ride`, {
        description: error.message || t`Please try again later.`,
      });
    },
  });

  const formValues: EditRideFormData | undefined = ride
    ? {
        dateTrip: formatDate(ride.departureTime, DateFormats.DATE_DASH_REVERSE),
        departureTime: formatDate(ride.departureTime, DateFormats.TIME),
        availableSeats: ride.availableSeats,
        pricePerSeat: ride.pricePerSeat,
        vehicleInfo: {
          make: ride.vehicleInfo?.make || "",
          model: ride.vehicleInfo?.model || "",
          color: ride.vehicleInfo?.color || "",
          licensePlate: ride.vehicleInfo?.licensePlate || "",
        },
        preferences: {
          smokingAllowed: ride.preferences?.smokingAllowed || false,
          petsAllowed: ride.preferences?.petsAllowed || false,
        },
        additionalInfo: ride.additionalInfo || "",
      }
    : undefined;

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<EditRideFormData>({
    resolver: zodResolver(
      useMemo(() => createEditRideSchema(), [])
    ) as Resolver<EditRideFormData>,
    values: formValues,
    defaultValues: {
      dateTrip: "",
      departureTime: undefined,
      availableSeats: 1,
      pricePerSeat: 0,
      vehicleInfo: {
        make: "",
        model: "",
        color: "",
        licensePlate: "",
      },
      preferences: {
        smokingAllowed: false,
        petsAllowed: false,
      },
      additionalInfo: "",
    },
  });

  const handleOnError = (errors: FieldErrors) => {
    const FIELD_LABELS: Record<string, string> = {
      dateTrip: "Trip Date",
      departureTime: "Departure Time",
      availableSeats: "Available Seats",
      pricePerSeat: "Price Per Seat",
      "vehicleInfo.make": "Vehicle Make",
      "vehicleInfo.model": "Vehicle Model",
      "vehicleInfo.color": "Vehicle Color",
      "vehicleInfo.licensePlate": "License Plate",
      "preferences.smokingAllowed": "Smoking Allowed",
      "preferences.petsAllowed": "Pets Allowed",
      additionalInfo: "Additional Information",
    };
    onError(FIELD_LABELS, errors);
  };

  const onSubmit = (data: EditRideFormData) => {
    mutation.mutate(data);
  };

  const bookedSeats = ride?.bookedSeats || 0;
  const hasBookings = bookedSeats > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Trans>Edit Ride</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Update the details of your ride. Note that you cannot change the
              origin and destination.
            </Trans>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <EditRideDialogSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit, handleOnError)}
            className="space-y-6"
            noValidate
          >
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>Route</Trans>
                  </Typography>
                </div>
                <div className="p-3 bg-muted/50 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <Typography className="font-medium">
                        {ride?.origin.city}
                      </Typography>
                      {ride?.origin.address && (
                        <Typography className="text-xs text-muted-foreground">
                          {ride?.origin.address}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <div className="ml-[5px] w-0.5 h-4 bg-border" />
                  <div className="flex items-start gap-2">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <Typography className="font-medium">
                        {ride?.destination.city}
                      </Typography>
                      {ride?.destination.address && (
                        <Typography className="text-xs text-muted-foreground">
                          {ride?.destination.address}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>When?</Trans>
                  </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    disabled
                    register={register}
                    name="dateTrip"
                    label={<Trans>Date</Trans>}
                    placeholder={t`Select a date`}
                    buttonClassName="w-full"
                  />

                  <div className="relative">
                    <CustomInput
                      type="time"
                      name="departureTime"
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
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>Capacity & Pricing</Trans>
                  </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <SeatsSelect
                      control={control}
                      name="availableSeats"
                      label={<Trans>Available Seats</Trans>}
                      maxSeats={8}
                      required
                    />
                    {hasBookings && (
                      <p className="text-xs text-muted-foreground px-1">
                        <Trans>Minimum: {bookedSeats} (already booked)</Trans>
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <CustomInput
                      name="pricePerSeat"
                      label={<Trans>Price per seat</Trans>}
                      register={register}
                      required
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-10 right-0 flex items-center justify-center pr-4">
                      <Euro className="size-4 z-10 opacity-50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>Vehicle Information</Trans>
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    name="vehicleInfo.make"
                    label={<Trans>Make</Trans>}
                    placeholder={t`e.g., Toyota`}
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.model"
                    label={<Trans>Model</Trans>}
                    placeholder={t`e.g., Camry`}
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.color"
                    label={<Trans>Color</Trans>}
                    placeholder={t`e.g., Silver`}
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.licensePlate"
                    label={<Trans>License Plate</Trans>}
                    placeholder={t`e.g., ABC-1234`}
                    register={register}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>Preferences</Trans>
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Switch
                    control={control}
                    name="preferences.smokingAllowed"
                    label={<Trans>Smoking allowed</Trans>}
                  />
                  <Switch
                    control={control}
                    name="preferences.petsAllowed"
                    label={<Trans>Pets allowed</Trans>}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    <Trans>Additional Information</Trans>
                  </Typography>
                </div>

                <CustomTextarea
                  name="additionalInfo"
                  label={<Trans>Any extra details?</Trans>}
                  placeholder={t`Any additional details passengers should know...`}
                  register={register}
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-end">
                  <Typography className="text-xs text-muted-foreground">
                    <Trans>Max 500 characters</Trans>
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? t`Saving...` : t`Save Changes`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditRideDialog;
