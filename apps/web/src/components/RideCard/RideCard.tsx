import { Trans } from "@lingui/react/macro";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  User,
  Users,
  Pencil,
  Car,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import {
  getRideStatusVariant,
  getRideStatusLabel,
  getBookingStatusVariant,
  getBookingStatusLabel,
} from "@/utils/myRidesUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isPast } from "@journey-link/shared";
import { i18n } from "@lingui/core";
import { UserRideRole } from "@/types/user.types";
import { RideStatus, UserRide } from "@journey-link/shared";

interface RideCardProps {
  ride: UserRide;
  viewType: UserRideRole;
  buttonLabel?: React.ReactNode;
  className?: string;
  onEdit?: (ride: UserRide) => void;
}

const RideCard = ({
  ride,
  viewType,
  buttonLabel = <Trans>View details</Trans>,
  className,
  onEdit,
}: RideCardProps) => {
  const statusVariant = getRideStatusVariant(ride.status);
  const statusLabel = getRideStatusLabel(ride.status);

  const isCompleted = ride.status === RideStatus.COMPLETED;
  const isCancelled = ride.status === RideStatus.CANCELLED;
  const canEdit =
    viewType === UserRideRole.AS_DRIVER &&
    !isCompleted &&
    !isCancelled &&
    !isPast(ride.departureTime);

  const departureDate = new Date(ride.departureTime);

  return (
    <Card
      className={cn(
        "shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300 border-l-4",
        isCompleted
          ? "border-l-success/50 hover:border-l-success"
          : isCancelled
            ? "border-l-destructive/50 hover:border-l-destructive"
            : "border-l-primary/40 hover:border-l-primary",
        className
      )}
    >
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 bg-primary/5 rounded-full ring-1 ring-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="flex items-center gap-2 flex-wrap">
              <Typography className="font-bold">{ride.origin.city}</Typography>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Typography className="font-bold">
                {ride.destination.city}
              </Typography>
            </span>
          </CardTitle>
          <TooltipProvider delayDuration={0}>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Badge
                      variant={statusVariant}
                      className="px-3 py-1 shrink-0 flex items-center gap-1 cursor-default"
                    >
                      <Car className="w-3 h-3" />
                      {statusLabel}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <Trans>Ride Status</Trans>: {statusLabel}
                  </p>
                </TooltipContent>
              </Tooltip>

              {viewType === UserRideRole.AS_PASSENGER && ride.bookingStatus && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Badge
                        variant={getBookingStatusVariant(ride.bookingStatus)}
                        className="px-3 py-1 shrink-0 flex items-center gap-1 cursor-default"
                      >
                        <Ticket className="w-3 h-3" />
                        {getBookingStatusLabel(ride.bookingStatus)}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      <Trans>Your Request</Trans>:{" "}
                      {getBookingStatusLabel(ride.bookingStatus)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <Typography className="font-medium">
              {i18n.date(departureDate, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </div>
          {viewType === UserRideRole.AS_PASSENGER && ride.driver && (
            <Link
              href={`/users/${ride.driver._id}/profile`}
              className="flex items-center gap-2 rounded-full hover:bg-muted/50 transition-colors p-1 -ml-1 pr-3 w-fit"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <Typography className="font-medium hover:underline">
                {ride.driver.firstName}
              </Typography>
              {!!ride.driver.rating.average && (
                <div className="flex items-center gap-1 ml-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <Typography className="font-semibold text-xs">
                    {ride.driver.rating.average}
                  </Typography>
                </div>
              )}
            </Link>
          )}
          {viewType === UserRideRole.AS_DRIVER && (
            <div className="flex items-center gap-2 pt-2">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              <Typography className="text-sm text-muted-foreground">
                <Trans>Booked</Trans>: {ride.totalPassengersBooked}
              </Typography>
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between items-center gap-4 pt-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <Typography className="text-2xl font-bold text-primary">
            {i18n.number(ride.pricePerSeat, {
              style: "currency",
              currency: "EUR",
            })}
          </Typography>
          <Typography className="text-xs text-muted-foreground">
            <Trans>per seat</Trans>
          </Typography>
        </div>
        <div className="flex gap-2">
          {canEdit && onEdit && (
            <Button
              size="default"
              variant="outline"
              className="font-semibold"
              onClick={() => onEdit(ride)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              <Trans>Edit</Trans>
            </Button>
          )}
          <Link href={`/my-rides/${ride._id}`}>
            <Button size="default" className="font-semibold" tabIndex={-1}>
              {buttonLabel}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RideCard;
