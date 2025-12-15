"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { IBooking, UserRideRole } from "@journey-link/shared";
import { User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "@/api-actions/booking";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RidePassengersListProps {
  bookings: IBooking[];
  rideId: string;
}

const RidePassengersList = ({ bookings, rideId }: RidePassengersListProps) => {
  const queryClient = useQueryClient();

  const { isPending, mutate: handleCancel } = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["ride-bookings", rideId] });
      queryClient.invalidateQueries({ queryKey: ["api/ride", rideId] });
      queryClient.invalidateQueries({
        queryKey: ["me/user-rides", UserRideRole.AS_DRIVER],
      });
    },
    onError: (error: any) => {
      toast.error(error.toString());
    },
  });

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Passengers</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography className="text-muted-foreground text-sm">
            No confirmed passengers yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passengers ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Link
              href={`/users/${booking.passenger._id}/profile`}
              className="flex items-center gap-3 flex-1"
            >
              <Avatar>
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Typography className="font-semibold text-sm hover:underline">
                  {booking.passenger.profile.firstName}{" "}
                  {booking.passenger.profile.lastName}
                </Typography>
                {booking.passenger.phoneNumber && (
                  <Typography className="text-xs text-muted-foreground">
                    {booking.passenger.phoneNumber}
                  </Typography>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MessageCircle className="w-4 h-4 text-primary" />
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isPending}
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to remove this passenger?"
                          )
                        ) {
                          handleCancel(booking._id);
                        }
                      }}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove passenger</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RidePassengersList;
