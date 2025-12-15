import Typography from "@/components/ui/typography";
import { Ride } from "@journey-link/shared";
import { Euro, User } from "lucide-react";

interface RideStatsProps {
  ride: Ride;
}

export const RideStats = ({ ride }: RideStatsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Euro className="w-4 h-4" />
            <span className="text-sm font-medium">Price per seat</span>
          </div>
          <Typography className="text-2xl font-bold text-primary">
            €{ride.pricePerSeat}
          </Typography>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Available Seats</span>
          </div>
          <Typography className="text-2xl font-bold text-primary">
            {ride.availableSeats}
          </Typography>
        </div>
      </div>

      {ride.additionalInfo && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <Typography className="font-semibold mb-2">
            Additional Information
          </Typography>
          <Typography className="text-muted-foreground">
            {ride.additionalInfo}
          </Typography>
        </div>
      )}
    </>
  );
};
