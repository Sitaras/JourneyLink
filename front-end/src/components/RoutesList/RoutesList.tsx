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
import { MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Route } from "@/types/routes.types";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Typography from "@/components/ui/typography";

interface RoutesListProps {
  routes?: Route[];
  isLoading?: boolean;
  className?: string;
}

export default function RoutesList({
  routes,
  isLoading,
  className,
}: RoutesListProps) {
  const { isAuthenticated } = useAuth();

  const cardDateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const urlDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <Typography className="text-muted-foreground">
          Loading routes...
        </Typography>
      </div>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <Card className="shadow-sm w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <MapPin className="w-12 h-12 text-muted-foreground/50" />
          <div className="text-center">
            <Typography className="font-semibold text-lg mb-1">
              No routes found
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
      {routes.map((route) => {
        const departureDate = new Date(route.departureTime);

        return (
          <Card
            key={route._id}
            className="shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{route.origin.city}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-bold">{route.destination.city}</span>
                </span>
              </CardTitle>
              {(route.origin.address || route.destination.address) && (
                <Typography className="text-sm text-muted-foreground ml-12">
                  {route.origin.address && route.destination.address
                    ? `${route.origin.address} → ${route.destination.address}`
                    : route.origin.address || route.destination.address}
                </Typography>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <Typography className="font-medium">
                    {cardDateFormatter.format(departureDate)}
                  </Typography>
                </div>
                <Badge className="px-3 py-1">
                  {route.remainingSeats} of {route.availableSeats} seats left
                </Badge>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-between items-center pt-4">
              <div className="flex flex-col gap-1">
                <Typography className="text-2xl font-bold">
                  €{route.pricePerSeat.toFixed(2)}
                </Typography>
                <Typography className="text-xs text-muted-foreground">
                  per seat
                </Typography>
              </div>

              {isAuthenticated && (
                <Link
                  href={`/route/${encodeURIComponent(
                    route.origin.city
                  )}/${encodeURIComponent(
                    route.destination.city
                  )}/${encodeURIComponent(
                    urlDateFormatter.format(departureDate)
                  )}/${encodeURIComponent(route._id)}`}
                >
                  <Button size="default" className="font-semibold">
                    View Details
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
