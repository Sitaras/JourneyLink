"use client";

import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState/LoadingState";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Typography from "@/components/ui/typography";
import BookingRequestsList from "@/components/BookingRequestsList/BookingRequestsList";
import RidePassengersList from "@/components/RidePassengersList/RidePassengersList";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EditRideDialog from "@/components/EditRideDialog/EditRideDialog";
import { useState, useEffect } from "react";
import {
  BookingStatus,
  IBooking,
  RideStatus,
  UserRideRole,
} from "@journey-link/shared";
import { cancelBooking, getRideBookings } from "@/api-actions/booking";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getRide } from "@/api-actions/ride";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { useAuth } from "@/context/AuthContext";
import { isPast } from "@/utils/dateUtils";
import { routes } from "@/configs/routes";
import { toast } from "sonner";
import { RideDetailsHeader } from "@/components/RideDetails/RideDetailsHeader";
import { RideRouteTimeline } from "@/components/RideDetails/RideRouteTimeline";
import { RideStats } from "@/components/RideDetails/RideStats";
import { PassengerDriverCard } from "@/components/RideDetails/PassengerDriverCard";
import { PassengerMyBookingCard } from "@/components/RideDetails/PassengerMyBookingCard";

const RideManagementPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: ride,
    isLoading: isRideLoading,
    refetch: refetchRide,
  } = useQuery({
    queryKey: ["api/ride", id],
    queryFn: () => {
      return getRide(id);
    },
  });

  const { user: userInfo, isLoading: isUserLoading } = useAuth();

  const { data: bookings } = useQuery({
    queryKey: ["ride-bookings", id],
    queryFn: () => getRideBookings(id),
    enabled: !!ride && !!userInfo && ride.driver === userInfo._id,
  });

  const queryClient = useQueryClient();

  const { isPending: isCancelling, mutate: handleCancelBooking } = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["ride-bookings", id] });
      queryClient.invalidateQueries({ queryKey: ["api/ride", id] });
      queryClient.invalidateQueries({
        queryKey: ["me/user-rides", UserRideRole.AS_PASSENGER],
      });
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  useEffect(() => {
    if (!isRideLoading && !isUserLoading && ride) {
      const isDriver = userInfo?._id === ride.driver;
      const myBooking = ride.myBooking;

      if (!isDriver && !myBooking) {
        router.replace(routes.myRides);
      }
    }
  }, [isRideLoading, isUserLoading, ride, userInfo, router]);

  if (isRideLoading || isUserLoading) {
    return <LoadingState />;
  }

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Typography variant="h3">Ride not found</Typography>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const isCompleted = ride?.status === RideStatus.COMPLETED;
  const isCancelled = ride?.status === RideStatus.CANCELLED;
  const isDriver = userInfo?._id === ride.driver;

  const canEdit =
    isDriver && !isCompleted && !isCancelled && !isPast(ride.departureTime);

  const confirmedPassengers =
    bookings?.filter((b: IBooking) => b.status === BookingStatus.CONFIRMED) ||
    [];

  const myBooking = ride?.myBooking;

  if (!isDriver && !myBooking) {
    return null;
  }

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-8 max-w-xl w-full">
        <div className="flex items-center justify-between">
          <BackButton label="Back to rides" />
          {canEdit && (
            <Button onClick={() => setIsEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Ride
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="space-y-6">
            <Card>
              <RideDetailsHeader
                ride={ride}
                isDriver={isDriver}
                myBooking={myBooking}
              />
              <div className="p-6 pt-0 space-y-6">
                <RideRouteTimeline ride={ride} />

                <Separator />

                <RideStats ride={ride} />
              </div>
            </Card>

            {/* Role Specific Content: Main Area */}
            {isDriver ? (
              <div className="space-y-6">
                <BookingRequestsList rideId={id} />
                <RidePassengersList
                  bookings={confirmedPassengers}
                  rideId={id}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Passenger specific content if any, maybe reviews or similar */}
              </div>
            )}
          </div>

          {/* Right Column: Driver Info / Status */}
          <div className="space-y-6 empty:hidden">
            {/* Driver Card (Visible to Passenger) */}
            {!isDriver && <PassengerDriverCard ride={ride} />}

            {/* Booking Status Card (Visible to Passenger) */}
            {!isDriver && myBooking && (
              <PassengerMyBookingCard
                ride={ride}
                booking={myBooking}
                isCancelling={isCancelling}
                onCancel={handleCancelBooking}
              />
            )}
          </div>
        </div>

        {isDriver && (
          <EditRideDialog
            rideId={id}
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={() => {
              setIsEditOpen(false);
              refetchRide();
              toast.success("Ride updated successfully");
            }}
          />
        )}
      </div>
    </section>
  );
};

export default RideManagementPage;
