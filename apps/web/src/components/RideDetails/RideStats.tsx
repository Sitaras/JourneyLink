import Typography from "@/components/ui/typography";
import { Ride } from "@journey-link/shared";
import { User } from "lucide-react";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";

interface RideStatsProps {
  ride: Ride;
}

export const RideStats = ({ ride }: RideStatsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <Typography className="text-sm font-medium text-muted-foreground mb-1">
            <Trans>Price per seat</Trans>
          </Typography>
          <Typography className="text-2xl font-bold text-primary">
            {i18n.number(ride.pricePerSeat, {
              style: "currency",
              currency: "EUR",
            })}
          </Typography>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <User className="w-4 h-4" />
            <Typography className="text-sm font-medium">
              <Trans>Available Seats</Trans>
            </Typography>
          </div>
          <Typography className="text-2xl font-bold text-primary">
            {ride.availableSeats}
          </Typography>
        </div>
      </div>

      {ride.additionalInfo && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <Typography className="font-semibold mb-2">
            <Trans>Additional Information</Trans>
          </Typography>
          <Typography className="text-muted-foreground">
            {ride.additionalInfo}
          </Typography>
        </div>
      )}
    </>
  );
};
