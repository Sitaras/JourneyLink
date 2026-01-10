"use client";
import { useRideRequests } from "@/hooks/queries/useRideQuery";
import LoadingState from "@/components/LoadingState/LoadingState";
import Typography from "@/components/ui/typography";
import BookingRequestCard from "./BookingRequestCard";
import { IBooking } from "@journey-link/shared";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BookingRequestsListProps {
  rideId: string;
}

const BookingRequestsList = ({ rideId }: BookingRequestsListProps) => {
  const { data, isLoading, error, refetch } = useRideRequests(rideId);
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-center text-destructive">
          Failed to load bookings. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <Inbox className="w-12 h-12 mb-3 opacity-50" />
          <Typography className="font-medium">
            No booking requests yet
          </Typography>
          <Typography className="text-sm">
            When passengers book your ride, their requests will appear here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
      {data.map((booking: IBooking) => (
        <BookingRequestCard
          key={booking._id}
          booking={booking}
          onStatusChange={refetch}
        />
      ))}
    </div>
  );
};

export default BookingRequestsList;
