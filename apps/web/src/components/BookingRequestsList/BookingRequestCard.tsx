"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import Typography from "@/components/ui/typography";
import { Check, X, Clock, User } from "lucide-react";
import Link from "next/link";
import { IBooking, BookingStatus } from "@journey-link/shared";
import { useMutation } from "@tanstack/react-query";
import { acceptBooking, declineBooking } from "@/api-actions/booking";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookingRequestCardProps {
  booking: IBooking;
  onStatusChange: () => void;
}

const BookingRequestCard = ({
  booking,
  onStatusChange,
}: BookingRequestCardProps) => {
  const isPending = booking.status === BookingStatus.PENDING;

  const acceptMutation = useMutation({
    mutationFn: () => acceptBooking(booking._id),
    onSuccess: () => {
      toast.success("Booking accepted");
      onStatusChange();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to accept booking");
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => declineBooking(booking._id),
    onSuccess: () => {
      toast.success("Booking declined");
      onStatusChange();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to decline booking");
    },
  });

  const isLoading = acceptMutation.isPending || declineMutation.isPending;

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href={`/users/${booking.passenger._id}/profile`}
          className="flex items-center gap-4 group"
        >
          <Avatar className="w-12 h-12 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
            <AvatarFallback>
              <User className="w-6 h-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Typography className="font-semibold text-base group-hover:text-primary transition-colors">
              {booking.passenger.profile.firstName}{" "}
              {booking.passenger.profile.lastName}
            </Typography>
            <div className="flex items-center gap-3 text-muted-foreground text-xs mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          {isPending ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none h-8 text-xs border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                onClick={() => declineMutation.mutate()}
                disabled={isLoading}
              >
                <X className="w-3 h-3 mr-1.5" />
                Decline
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none h-8 text-xs bg-primary hover:bg-primary/90"
                onClick={() => acceptMutation.mutate()}
                disabled={isLoading}
              >
                <Check className="w-3 h-3 mr-1.5" />
                Accept
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border",
                booking.status === BookingStatus.CONFIRMED
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              )}
            >
              {booking.status === BookingStatus.CONFIRMED ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              {booking.status.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingRequestCard;
