"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UserRide } from "@journey-link/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateRide } from "@/api-actions/ride";
import { toast } from "sonner";
import { z } from "zod";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import Typography from "@/components/ui/typography";

const editRideSchema = z.object({
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
  ride: UserRide;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRideDialog = ({
  ride,
  open,
  onClose,
  onSuccess,
}: EditRideDialogProps) => {
  const mutation = useMutation({
    mutationFn: async (data: EditRideFormData) => {
      return updateRide(ride._id, data);
    },
    onSuccess: () => {
      toast.success("Ride updated successfully", {
        description: "Your changes have been saved.",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error("Failed to update ride", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditRideFormData>({
    resolver: zodResolver(editRideSchema),
    defaultValues: {
      departureTime: formatDate(
        ride.departureTime,
        DateFormats.DATETIME_LOCAL
      ),
      availableSeats: ride.availableSeats || 1,
      pricePerSeat: ride.pricePerSeat || 0,
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

  const smokingAllowed = watch("preferences.smokingAllowed");
  const petsAllowed = watch("preferences.petsAllowed");
  const additionalInfo = watch("additionalInfo");

  const onSubmit = (data: EditRideFormData) => {
    mutation.mutate(data);
  };

  const bookedSeats = ride.totalPassengersBooked || 0;
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Route</Label>
            <div className="p-3 bg-muted rounded-md">
              <Typography className="text-sm">
                <span className="font-medium">{ride.origin.city}</span>
                {ride.origin.address && (
                  <span className="text-muted-foreground">
                    {" "}
                    • {ride.origin.address}
                  </span>
                )}
              </Typography>
              <Typography className="text-sm text-muted-foreground my-1">
                ↓
              </Typography>
              <Typography className="text-sm">
                <span className="font-medium">{ride.destination.city}</span>
                {ride.destination.address && (
                  <span className="text-muted-foreground">
                    {" "}
                    • {ride.destination.address}
                  </span>
                )}
              </Typography>
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="departureTime">
              Departure Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="departureTime"
              type="datetime-local"
              {...register("departureTime")}
              className={errors.departureTime ? "border-destructive" : ""}
            />
            {errors.departureTime && (
              <p className="text-sm text-destructive">
                {errors.departureTime.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableSeats">
                Available Seats <span className="text-destructive">*</span>
              </Label>
              <Input
                id="availableSeats"
                type="number"
                min={hasBookings ? bookedSeats : 1}
                max="8"
                {...register("availableSeats")}
                className={errors.availableSeats ? "border-destructive" : ""}
              />
              {hasBookings && (
                <p className="text-xs text-muted-foreground">
                  Minimum: {bookedSeats} (already booked)
                </p>
              )}
              {errors.availableSeats && (
                <p className="text-sm text-destructive">
                  {errors.availableSeats.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerSeat">
                Price per Seat (€) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pricePerSeat"
                type="number"
                step="0.01"
                min="0"
                {...register("pricePerSeat")}
                className={errors.pricePerSeat ? "border-destructive" : ""}
              />
              {errors.pricePerSeat && (
                <p className="text-sm text-destructive">
                  {errors.pricePerSeat.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Vehicle Information
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vehicleMake" className="text-sm font-normal">
                  Make
                </Label>
                <Input
                  id="vehicleMake"
                  placeholder="e.g., Toyota"
                  {...register("vehicleInfo.make")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel" className="text-sm font-normal">
                  Model
                </Label>
                <Input
                  id="vehicleModel"
                  placeholder="e.g., Camry"
                  {...register("vehicleInfo.model")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleColor" className="text-sm font-normal">
                  Color
                </Label>
                <Input
                  id="vehicleColor"
                  placeholder="e.g., Silver"
                  {...register("vehicleInfo.color")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="vehicleLicense"
                  className="text-sm font-normal"
                >
                  License Plate
                </Label>
                <Input
                  id="vehicleLicense"
                  placeholder="e.g., ABC-1234"
                  {...register("vehicleInfo.licensePlate")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Preferences</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="space-y-0.5">
                  <Label htmlFor="smokingAllowed" className="font-normal">
                    Smoking Allowed
                  </Label>
                  <Typography className="text-xs text-muted-foreground">
                    Allow passengers to smoke during the ride
                  </Typography>
                </div>
                <Switch
                  id="smokingAllowed"
                  checked={smokingAllowed}
                  onCheckedChange={(checked) =>
                    setValue("preferences.smokingAllowed", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="space-y-0.5">
                  <Label htmlFor="petsAllowed" className="font-normal">
                    Pets Allowed
                  </Label>
                  <Typography className="text-xs text-muted-foreground">
                    Allow passengers to bring pets
                  </Typography>
                </div>
                <Switch
                  id="petsAllowed"
                  checked={petsAllowed}
                  onCheckedChange={(checked) =>
                    setValue("preferences.petsAllowed", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional details passengers should know..."
              maxLength={500}
              rows={4}
              {...register("additionalInfo")}
              className={errors.additionalInfo ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              <Typography className="text-xs text-muted-foreground">
                {additionalInfo?.length || 0}/500 characters
              </Typography>
              {errors.additionalInfo && (
                <p className="text-sm text-destructive">
                  {errors.additionalInfo.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
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
      </DialogContent>
    </Dialog>
  );
};

export default EditRideDialog;