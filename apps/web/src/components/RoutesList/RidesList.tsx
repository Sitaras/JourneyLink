"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ride } from "@journey-link/shared";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Typography from "@/components/ui/typography";
import LoadingState from "../LoadingState/LoadingState";
import { i18n } from "@lingui/core";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";

interface RidesListProps {
  rides?: Ride[];
  isLoading?: boolean;
  className?: string;
}

export default function RidesList({
  rides,
  isLoading,
  className,
}: RidesListProps) {
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!rides || rides.length === 0) {
    return (
      <Card className="shadow-sm w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <MapPin className="w-12 h-12 text-muted-foreground/50" />
          <div className="text-center">
            <Typography className="font-semibold text-lg mb-1">
              No rides found
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              Try adjusting your search criteria or check back later
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {rides.map((ride) => {
        const departureDate = new Date(ride.departureTime);

        return (
          <Card
            key={ride._id}
            className="shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary"
          >
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="flex items-center gap-2 flex-wrap">
                  <Typography className="font-bold">
                    {ride.origin.city}
                  </Typography>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Typography className="font-bold">
                    {ride.destination.city}
                  </Typography>
                </span>
              </CardTitle>
              {(ride.origin.address || ride.destination.address) && (
                <Typography className="text-sm text-muted-foreground ml-12">
                  {ride.origin.address && ride.destination.address
                    ? `${ride.origin.address} → ${ride.destination.address}`
                    : ride.origin.address || ride.destination.address}
                </Typography>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <Typography className="font-medium">
                    {i18n.date(departureDate, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Typography>
                </div>
                <Badge className="px-3 py-1">
                  {ride.remainingSeats} of {ride.availableSeats} seats left
                </Badge>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-between items-center pt-4">
              <div className="flex flex-col gap-1">
                <Typography className="text-2xl font-bold">
                  {i18n.number(ride.pricePerSeat, {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Typography>
                <Typography className="text-xs text-muted-foreground">
                  per seat
                </Typography>
              </div>

              {isAuthenticated && (
                <Link
                  href={`/ride/${encodeURIComponent(
                    ride.origin.city
                  )}/${encodeURIComponent(
                    ride.destination.city
                  )}/${encodeURIComponent(
                    formatDate(departureDate, DateFormats.DATE_SLASH_FORMAT)
                  )}/${encodeURIComponent(ride._id)}`}
                >
                  <Button size="default" className="font-semibold">
                    View details
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
