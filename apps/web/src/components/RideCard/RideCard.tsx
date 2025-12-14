import React from "react";
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
} from "lucide-react";
import Link from "next/link";
import { getRideStatusVariant, getRideStatusLabel } from "@/utils/myRidesUtils";
import { isPast } from "@/utils/dateUtils";
import { UserRideRole } from "@/types/user.types";
import { RideStatus, UserRide } from "@journey-link/shared";
import { dateTimeFormatter } from "@/utils/formatters";

interface RideCardProps {
  ride: UserRide;
  viewType: UserRideRole;
  buttonLabel?: string;
  className?: string;
  onEdit?: (ride: UserRide) => void;
}

const RideCard = ({
  ride,
  viewType,
  buttonLabel = "View details",
  className,
  onEdit,
}: RideCardProps) => {
  const statusVariant = getRideStatusVariant(ride.status);
  const statusLabel = getRideStatusLabel(ride.status, ride.departureTime);

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
        "shadow-sm hover:shadow-lg transition-all duration-300 border-l-4",
        isCompleted
          ? "border-l-green-500/50 hover:border-l-green-500"
          : isCancelled
            ? "border-l-red-500/50 hover:border-l-red-500"
            : "border-l-primary/20 hover:border-l-primary",
        className
      )}
    >
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-full">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="flex items-center gap-2 flex-wrap">
              <Typography className="font-bold">{ride.origin.city}</Typography>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Typography className="font-bold">
                {ride.destination.city}
              </Typography>
            </span>
          </CardTitle>
          <Badge variant={statusVariant} className="px-3 py-1 shrink-0">
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <Typography className="font-medium">
              {dateTimeFormatter.format(departureDate)}
            </Typography>
          </div>
          {viewType === UserRideRole.AS_PASSENGER && ride.driver && (
            <div className="flex items-center gap-2 rounded-full">
              <User className="w-3.5 h-3.5 text-primary" />
              <Typography className="font-medium">
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
            </div>
          )}
          {viewType === UserRideRole.AS_DRIVER && (
            <div className="flex items-center gap-2 pt-2">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              <Typography className="text-sm text-muted-foreground">
                Booked: {ride.totalPassengersBooked}
              </Typography>
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between items-center gap-4 pt-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <Typography className="text-2xl font-bold text-primary">
            €{ride.pricePerSeat?.toFixed(2)}
          </Typography>
          <Typography className="text-xs text-muted-foreground">
            per seat
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
              Edit
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
