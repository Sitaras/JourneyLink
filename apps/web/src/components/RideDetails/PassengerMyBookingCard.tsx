import BookingButton from "@/components/BookingButton/BookingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus, IBooking, Ride } from "@journey-link/shared";
import { Loader2 } from "lucide-react";

interface PassengerMyBookingCardProps {
  ride: Ride;
  booking: IBooking;
  isCancelling: boolean;
  onCancel: (bookingId: string) => void;
}

export const PassengerMyBookingCard = ({
  ride,
  booking,
  isCancelling,
  onCancel,
}: PassengerMyBookingCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>My Booking</CardTitle>
        {(booking.status === BookingStatus.CANCELLED ||
          booking.status === BookingStatus.DECLINED) && (
          <BookingButton
            rideId={ride._id}
            canBook={ride.canBook ?? false}
            variant="icon"
            className="h-8 w-8"
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge
              variant={
                booking.status === BookingStatus.CONFIRMED
                  ? "success"
                  : booking.status === BookingStatus.PENDING
                    ? "secondary"
                    : "destructive"
              }
            >
              {booking.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Booked on</span>
            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {(booking.status === BookingStatus.CONFIRMED ||
          booking.status === BookingStatus.PENDING) && (
          <Button
            className="w-full mt-4"
            onClick={() => {
              if (confirm("Are you sure you want to cancel your booking?")) {
                onCancel(booking._id);
              }
            }}
            disabled={isCancelling}
          >
            {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel booking
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
