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
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Route } from "@/types/routes";

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
  if (isLoading)
    return (
      <p className="text-center text-muted-foreground">Loading routes...</p>
    );

  if (!routes || routes.length === 0)
    return (
      <p className="text-center text-muted-foreground">No routes found.</p>
    );

  return (
    <div className={cn("flex flex-col gap-4 w-full ", className)}>
      {routes?.map((route) => (
        <Card key={route._id} className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {route.origin.city} → {route.destination.city}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {route.origin.address} → {route.destination.address}
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(route.departureTime).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <Badge variant="outline">
                {route.remainingSeats} / {route.availableSeats} seats left
              </Badge>
            </div>

            {/* <Separator /> */}

            {/* <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                <span>
                  {route.vehicleInfo.make} {route.vehicleInfo.model} —{" "}
                  {route.vehicleInfo.color}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{route.driver.firstName}</span>
              </div>
            </div> */}

            <Separator />

            {/* <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant={
                  route.preferences.smokingAllowed ? "default" : "secondary"
                }
                className="flex items-center gap-1"
              >
                <Cigarette className="w-3 h-3" />
                {route.preferences.smokingAllowed ? "Smoking" : "No Smoking"}
              </Badge>
              <Badge
                variant={
                  route.preferences.petsAllowed ? "default" : "secondary"
                }
                className="flex items-center gap-1"
              >
                <PawPrint className="w-3 h-3" />
                {route.preferences.petsAllowed ? "Pets allowed" : "No pets"}
              </Badge>
              {route.preferences.maxTwoInBack && (
                <Badge variant="secondary">Max 2 in back</Badge>
              )}
            </div> */}

            {/* {route.additionalInfo && (
              <p className="text-sm text-muted-foreground mt-3">
                {route.additionalInfo}
              </p>
            )} */}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <p className="font-semibold text-lg">
              {route.pricePerSeat.toFixed(2)} €
            </p>
            <Button size="sm" variant="default">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
