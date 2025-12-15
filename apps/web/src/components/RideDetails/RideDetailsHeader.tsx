import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dateTimeFormatter } from "@/utils/formatters";
import {
  getBookingStatusLabel,
  getBookingStatusVariant,
  getRideStatusLabel,
  getRideStatusVariant,
} from "@/utils/myRidesUtils";
import { Calendar, Car, Ticket } from "lucide-react";
import { Ride } from "@journey-link/shared";

interface RideDetailsHeaderProps {
  ride: Ride & { myBooking?: any };
  isDriver: boolean;
  myBooking: any;
}

export const RideDetailsHeader = ({
  ride,
  isDriver,
  myBooking,
}: RideDetailsHeaderProps) => {
  const statusVariant = getRideStatusVariant(ride.status);
  const statusLabel = getRideStatusLabel(ride.status);

  return (
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
                      variant={getBookingStatusVariant(myBooking.status)}
                      className="text-sm px-3 py-1 flex items-center gap-1 cursor-default"
                    >
                      <Ticket className="w-3 h-3" />
                      {getBookingStatusLabel(myBooking.status)}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your Request: {getBookingStatusLabel(myBooking.status)}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>
    </CardHeader>
  );
};
