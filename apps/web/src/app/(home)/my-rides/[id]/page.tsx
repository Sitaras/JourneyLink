"use client";

import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState/LoadingState";
import { Button } from "@/components/ui/button";
import { Calendar, Euro, User, Pencil, Car, Ticket } from "lucide-react";
import Typography from "@/components/ui/typography";
import BookingRequestsList from "@/components/BookingRequestsList/BookingRequestsList";
import RidePassengersList from "@/components/RidePassengersList/RidePassengersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dateTimeFormatter } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import {
  getRideStatusLabel,
  getRideStatusVariant,
  getBookingStatusLabel,
  getBookingStatusVariant,
} from "@/utils/myRidesUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import EditRideDialog from "@/components/EditRideDialog/EditRideDialog";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookingStatus, IBooking, RideStatus } from "@journey-link/shared";
import { getRideBookings } from "@/api-actions/booking";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRide } from "@/api-actions/ride";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { useAuth } from "@/context/AuthContext";
import { isPast } from "@/utils/dateUtils";
import { routes } from "@/configs/routes";

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

  const statusVariant = getRideStatusVariant(ride.status);
  const statusLabel = getRideStatusLabel(ride.status);

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
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">Ride Details</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {dateTimeFormatter.format(new Date(ride.departureTime))}
                      </span>
                    </div>
                  </div>

                  <TooltipProvider delayDuration={0}>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Badge
                              variant={statusVariant}
                              className="text-sm px-3 py-1 flex items-center gap-1 cursor-default"
                            >
                              <Car className="w-3 h-3" />
                              {statusLabel}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ride Status: {statusLabel}</p>
                        </TooltipContent>
                      </Tooltip>

                      {!isDriver && myBooking && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Badge
                                variant={getBookingStatusVariant(
                                  myBooking.status
                                )}
                                className="text-sm px-3 py-1 flex items-center gap-1 cursor-default"
                              >
                                <Ticket className="w-3 h-3" />
                                {getBookingStatusLabel(myBooking.status)}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Your Request:{" "}
                              {getBookingStatusLabel(myBooking.status)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-background" />
                    <div className="space-y-1">
                      <Typography className="text-sm text-muted-foreground font-medium">
                        From
                      </Typography>
                      <Typography className="font-semibold text-lg">
                        {ride.origin.city}
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        {ride.origin.address}
                      </Typography>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary" />
                    <div className="space-y-1">
                      <Typography className="text-sm text-muted-foreground font-medium">
                        To
                      </Typography>
                      <Typography className="font-semibold text-lg">
                        {ride.destination.city}
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        {ride.destination.address}
                      </Typography>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Euro className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Price per seat
                      </span>
                    </div>
                    <Typography className="text-2xl font-bold text-primary">
                      €{ride.pricePerSeat}
                    </Typography>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Available Seats
                      </span>
                    </div>
                    <Typography className="text-2xl font-bold text-primary">
                      {ride.availableSeats}
                    </Typography>
                  </div>
                </div>

                {ride.additionalInfo && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <Typography className="font-semibold mb-2">
                      Additional Information
                    </Typography>
                    <Typography className="text-muted-foreground">
                      {ride.additionalInfo}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Specific Content: Main Area */}
            {isDriver ? (
              <div className="space-y-6">
                <BookingRequestsList rideId={id} />
                <RidePassengersList bookings={confirmedPassengers} />
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
            {!isDriver && (
              <Card>
                <CardHeader>
                  <CardTitle>Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/profile/${ride.driver}`}
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Typography className="font-semibold text-lg hover:underline">
                        {ride.driverProfile.firstName}{" "}
                        {ride.driverProfile.lastName}
                      </Typography>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="text-sm font-bold">
                          {ride.driverProfile.rating?.average || "New"}
                        </span>
                        {ride.driverProfile.rating?.count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({ride.driverProfile.rating.count} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Booking Status Card (Visible to Passenger) */}
            {!isDriver && myBooking && (
              <Card>
                <CardHeader>
                  <CardTitle>My Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          myBooking.status === BookingStatus.CONFIRMED
                            ? "success"
                            : myBooking.status === BookingStatus.PENDING
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {myBooking.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Booked on</span>
                      <span>
                        {new Date(myBooking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
