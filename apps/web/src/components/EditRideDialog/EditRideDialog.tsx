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
import { Ride } from "@journey-link/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getRide, updateRide } from "@/api-actions/ride";
import { toast } from "sonner";
import { z } from "zod";
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

const editRideSchema = z.object({
  dateTrip: z.date(),
  departureTime: z.string().min(1, "Departure time is required"),
  availableSeats: z.coerce
    .number()
    .min(1, "At least 1 seat is required")
    .max(8, "Maximum 8 seats allowed"),
  pricePerSeat: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(1000, "Price seems too high"),
  vehicleInfo: z
    .object({
      make: z.string().optional(),
      model: z.string().optional(),
      color: z.string().optional(),
      licensePlate: z.string().optional(),
    })
    .optional(),
  preferences: z.object({
    smokingAllowed: z.boolean(),
    petsAllowed: z.boolean(),
  }),
  additionalInfo: z.string().max(500, "Maximum 500 characters").optional(),
});

type EditRideFormData = z.infer<typeof editRideSchema>;

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
  } = useQuery<unknown, unknown, Ride>({
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
      toast.success("Ride updated successfully", {
        description: "Your changes have been saved.",
      });
      onSuccess();
      refetch();
    },
    onError: (error: Error) => {
      toast.error("Failed to update ride", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const formValues: EditRideFormData | undefined = ride
    ? {
        dateTrip: new Date(ride.departureTime),
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
    resolver: zodResolver(editRideSchema),
    values: formValues,
    defaultValues: {
      dateTrip: undefined,
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

  const onSubmit = (data: EditRideFormData) => {
    mutation.mutate(data);
  };

  const bookedSeats = ride?.bookedSeats || 0;
  const hasBookings = bookedSeats > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ride</DialogTitle>
          <DialogDescription>
            Update the details of your ride. Note that you cannot change the
            origin and destination.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <EditRideDialogSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    Route
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
                    When?
                  </Typography>
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
                      name="departureTime"
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
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    Capacity & Pricing
                  </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <SeatsSelect
                      control={control}
                      name="availableSeats"
                      label="Available Seats"
                      maxSeats={8}
                      required
                    />
                    {hasBookings && (
                      <p className="text-xs text-muted-foreground px-1">
                        Minimum: {bookedSeats} (already booked)
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <CustomInput
                      name="pricePerSeat"
                      label="Price per seat"
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
                    Vehicle Information
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    name="vehicleInfo.make"
                    label="Make"
                    placeholder="e.g., Toyota"
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.model"
                    label="Model"
                    placeholder="e.g., Camry"
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.color"
                    label="Color"
                    placeholder="e.g., Silver"
                    register={register}
                  />
                  <CustomInput
                    name="vehicleInfo.licensePlate"
                    label="License Plate"
                    placeholder="e.g., ABC-1234"
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
                    Preferences
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Switch
                    control={control}
                    name="preferences.smokingAllowed"
                    label="Smoking allowed"
                  />
                  <Switch
                    control={control}
                    name="preferences.petsAllowed"
                    label="Pets allowed"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  <Typography className="font-semibold text-lg">
                    Additional Information
                  </Typography>
                </div>

                <CustomTextarea
                  name="additionalInfo"
                  label="Any extra details?"
                  placeholder="Any additional details passengers should know..."
                  register={register}
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-end">
                  <Typography className="text-xs text-muted-foreground">
                    Max 500 characters
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
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditRideDialog;
