"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Typography from "../ui/typography";
import { bookSeat } from "@/api-actions/booking";

const BookingButton = ({
  rideId,
  isBookingAvailable,
}: {
  rideId: string;
  isBookingAvailable: boolean;
}) => {
  const mutation = useMutation({
    mutationFn: async (rideId: string) => {
      return bookSeat({ rideId });
    },
    onSuccess: () => {
      toast.success(
        "Booking request sent! The driver will contact you shortly."
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to book seat. Please try again.");
    },
  });

  return (
    <>
      <Button
        size="lg"
        type="button"
        className="w-full text-base font-semibold"
        disabled={mutation.isPending || !isBookingAvailable}
        loading={mutation.isPending}
        onClick={() => {
          mutation.mutate(rideId);
        }}
      >
        {isBookingAvailable ? "Book Your Seat" : "Fully Booked"}
      </Button>
      {!isBookingAvailable && (
        <Typography className="text-sm text-center text-muted-foreground mt-2">
          This ride is unavailable. Try searching for other available rides or
          check back later.
        </Typography>
      )}
    </>
  );
};

export default BookingButton;
