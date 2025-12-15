import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { Ride } from "@journey-link/shared";
import { User } from "lucide-react";
import Link from "next/link";

interface PassengerDriverCardProps {
  ride: Ride;
}

export const PassengerDriverCard = ({ ride }: PassengerDriverCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver</CardTitle>
      </CardHeader>
      <CardContent>
        <Link
          href={`/users/${ride.driver}/profile`}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-14 h-14">
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Typography className="font-semibold text-lg hover:underline">
              {ride.driverProfile.firstName} {ride.driverProfile.lastName}
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
  );
};
