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
import { ArrowRight, Calendar, MapPin, Star, User, Users } from "lucide-react";
import Link from "next/link";
import type { Ride } from "@/types/ride.types";
import { getStatusVariant, getStatusLabel } from "@/utils/myRidesUtils";

interface RideCardProps {
  ride: Ride;
  viewType: "passenger" | "driver";
  buttonLabel?: string;
  className?: string;
}

const RideCard = ({
  ride,
  viewType,
  buttonLabel = "View details",
  className,
}: RideCardProps) => {
  const cardDateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusVariant = getStatusVariant(ride.status);
  const isCompleted = ride.status === "completed";
  const isCancelled = ride.status === "cancelled" || ride.status === "rejected";

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
              <Typography className="font-bold">{ride.origin}</Typography>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Typography className="font-bold">{ride.destination}</Typography>
            </span>
          </CardTitle>
          <Badge variant={statusVariant} className="px-3 py-1 shrink-0">
            {getStatusLabel(ride.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <Typography className="font-medium">
              {cardDateFormatter.format(ride.departureDate)}
            </Typography>
          </div>
          {viewType === "passenger" && ride.driver && (
            <div className="flex items-center gap-2 rounded-full">
              <User className="w-3.5 h-3.5 text-primary" />
              <Typography className="font-medium">
                {ride.driver.name}
              </Typography>
              {ride.driver.rating && (
                <div className="flex items-center gap-1 ml-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <Typography className="font-semibold text-xs">
                    {ride.driver.rating}
                  </Typography>
                </div>
              )}
            </div>
          )}
          {viewType === "driver" &&
            ride.passengers &&
            ride.passengers.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                <Typography className="text-sm text-muted-foreground">
                  {ride.passengers.length} passenger
                  {ride.passengers.length !== 1 ? "s" : ""} booked
                </Typography>
              </div>
            )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex flex-col gap-1">
          <Typography className="text-2xl font-bold text-primary">
            €{ride.pricePerSeat?.toFixed(2)}
          </Typography>
          <Typography className="text-xs text-muted-foreground">
            per seat
          </Typography>
        </div>
        <Link href={`/my-rides/${ride.id}`}>
          <Button size="default" className="font-semibold" tabIndex={-1}>
            {buttonLabel}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RideCard;
