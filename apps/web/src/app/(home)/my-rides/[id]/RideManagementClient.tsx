"use client";

import { Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import BookingRequestsList from "@/components/BookingRequestsList/BookingRequestsList";
import RidePassengersList from "@/components/RidePassengersList/RidePassengersList";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/ui/BackButton";
import LoadingState from "@/components/LoadingState/LoadingState";
import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { RideDetailsHeader } from "@/components/RideDetails/RideDetailsHeader";
import { RideRouteTimeline } from "@/components/RideDetails/RideRouteTimeline";
import { RideStats } from "@/components/RideDetails/RideStats";
import { PassengerDriverCard } from "@/components/RideDetails/PassengerDriverCard";
import { PassengerMyBookingCard } from "@/components/RideDetails/PassengerMyBookingCard";
import { Trans } from "@lingui/react/macro";
import { useCancelBookingMutation } from "@/hooks/mutations/useBookingMutations";
import { useRide, useRideRequests } from "@/hooks/queries/useRideQuery";
import { useAuth } from "@/context/AuthClient";
import { isPast } from "@journey-link/shared";
import { routes } from "@/configs/routes";
import { BookingStatus, IBooking, RideStatus } from "@journey-link/shared";

const RideManagementClient = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: ride, isLoading: isRideLoading, isError } = useRide(id);

  const { user: userInfo, isLoading: isUserLoading } = useAuth();

  const { data: bookings } = useRideRequests(id);

  const { mutate: handleCancelBooking, isPending: isCancelling } =
    useCancelBookingMutation(id as string);

  useEffect(() => {
    if (!isRideLoading && !isUserLoading && ride) {
      const isDriver = userInfo?._id === ride.driver;
      const myBooking = ride.myBooking;

      if (!isDriver && !myBooking) {
        router.replace(routes.myRides);
      }
    }
  }, [isRideLoading, isUserLoading, ride, userInfo, router]);

  if (isError) {
    return (
      <div className="container py-8 text-center text-red-500">
        Failed to load ride details
      </div>
    );
  }

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
            <Button onClick={() => router.push(`${routes.myRides}/${id}/edit`)}>
              <Pencil className="w-4 h-4 mr-2" />
              <Trans>Edit Ride</Trans>
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

          <div className="space-y-6 empty:hidden">
            {!isDriver && <PassengerDriverCard ride={ride} />}

            {!isDriver && myBooking && (
              <PassengerMyBookingCard
                ride={ride}
                booking={myBooking}
                isCancelling={isCancelling}
                onCancel={() => handleCancelBooking(myBooking._id)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RideManagementClient;
