import { getRideById } from "@/lib/rideApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Cigarette,
  PawPrint,
  Car,
  UserRoundIcon,
  Star,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BookingButton from "@/components/BookingButton/BookingButton";
import { dateFormatter, timeFormatter } from "@/utils/formatters";

export default async function Ride({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [, , , rideId] = slug;

  const { data: rideData } = await getRideById(rideId);

  if (!rideData) {
    return (
      <section className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Typography className="text-lg font-semibold mb-2">
              Ride not found
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              The ride you are looking for does not exist or has been removed.
            </Typography>
          </CardContent>
        </Card>
      </section>
    );
  }

  const departureDate = dateFormatter.format(new Date(rideData.departureTime));

  const departureTime = timeFormatter.format(new Date(rideData.departureTime));

  const hasRating =
    !!rideData.driverProfile.rating.average ||
    !!rideData.driverProfile.rating.count;

  return (
    <section className="flex flex-col gap-8 items-center w-full py-8 px-4">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        {/* Driver Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-6 gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary/5">
                <UserRoundIcon className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <Typography className="font-semibold text-lg">
                {rideData.driverProfile.firstName}
              </Typography>
              <Typography className="text-xs text-muted-foreground uppercase tracking-wide">
                Driver
              </Typography>
              {hasRating && (
                <div className="flex items-center gap-2 mt-1">
                  {!!rideData.driverProfile.rating.average && (
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <Typography className="text-sm font-medium">
                        {rideData.driverProfile.rating.average}
                      </Typography>
                    </div>
                  )}
                  {!!rideData.driverProfile.rating.count && (
                    <Typography className="text-xs text-muted-foreground">
                      ({rideData.driverProfile.rating.count + "rides"} )
                    </Typography>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ride Details Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="flex items-center gap-2">
                {rideData.origin.city}
                <span className="text-muted-foreground">→</span>
                {rideData.destination.city}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Date and Seats */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  {departureDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-6">
                  <Clock className="w-3 h-3" />
                  {departureTime}
                </div>
              </div>
              <Badge className="text-sm px-3 py-1">
                {rideData.remainingSeats} of {rideData.availableSeats} left
              </Badge>
            </div>

            <Separator />

            {/* Preferences */}
            <div>
              <Typography className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Preferences
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    rideData.preferences.smokingAllowed
                      ? "default"
                      : "secondary"
                  }
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  <Cigarette className="w-3.5 h-3.5" />
                  {rideData.preferences.smokingAllowed
                    ? "Smoking allowed"
                    : "No smoking"}
                </Badge>
                <Badge
                  variant={
                    rideData.preferences.petsAllowed ? "default" : "secondary"
                  }
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  <PawPrint className="w-3.5 h-3.5" />
                  {rideData.preferences.petsAllowed
                    ? "Pets allowed"
                    : "No pets"}
                </Badge>
              </div>
            </div>

            {/* Vehicle Info */}
            {rideData.vehicleInfo && (
              <>
                <Separator />
                <div>
                  <Typography className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Vehicle
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary flex-shrink-0" />
                    <Typography className="text-sm">
                      {rideData?.vehicleInfo?.make}{" "}
                      {rideData?.vehicleInfo?.model}
                      <span className="text-muted-foreground">
                        {" "}
                        • {rideData?.vehicleInfo?.color}
                      </span>
                    </Typography>
                  </div>
                </div>
              </>
            )}

            {/* Additional Info */}
            {rideData.additionalInfo && (
              <>
                <Separator />
                <div>
                  <Typography className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Additional Information
                  </Typography>
                  <Typography className="text-sm leading-relaxed">
                    {rideData.additionalInfo}
                  </Typography>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Price Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <Typography className="text-2xl font-bold">
                €{rideData.pricePerSeat}
              </Typography>
              <Typography className="text-sm text-muted-foreground mt-1">
                per seat
              </Typography>
            </div>
            <Typography className="text-sm text-muted-foreground">
              Total for all seats
            </Typography>
          </CardContent>
        </Card>

        <BookingButton rideId={rideData._id} isBookingAvailable />
      </div>
    </section>
  );
}
