"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { IBooking } from "@journey-link/shared";
import { User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RidePassengersListProps {
  bookings: IBooking[];
}

const RidePassengersList = ({ bookings }: RidePassengersListProps) => {
  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Passengers</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography className="text-muted-foreground text-sm">
            No confirmed passengers yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passengers ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Link
              href={`/profile/${booking.passenger._id}`}
              className="flex items-center gap-3 flex-1"
            >
              <Avatar>
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Typography className="font-semibold text-sm hover:underline">
                  {booking.passenger.profile.firstName}{" "}
                  {booking.passenger.profile.lastName}
                </Typography>
                {booking.passenger.phoneNumber && (
                  <Typography className="text-xs text-muted-foreground">
                    {booking.passenger.phoneNumber}
                  </Typography>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MessageCircle className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RidePassengersList;
