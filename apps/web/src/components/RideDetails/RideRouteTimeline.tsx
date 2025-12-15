import Typography from "@/components/ui/typography";
import { Ride } from "@journey-link/shared";

interface RideRouteTimelineProps {
  ride: Ride;
}

export const RideRouteTimeline = ({ ride }: RideRouteTimelineProps) => {
  return (
    <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-primary/20 ml-2">
      <div className="relative">
        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-background" />
        <div className="space-y-1">
          <Typography className="text-sm text-muted-foreground font-medium">
            From
          </Typography>
          <Typography className="font-semibold text-lg">
            {ride.origin.city}
          </Typography>
          <Typography className="text-muted-foreground text-sm">
            {ride.origin.address}
          </Typography>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary" />
        <div className="space-y-1">
          <Typography className="text-sm text-muted-foreground font-medium">
            To
          </Typography>
          <Typography className="font-semibold text-lg">
            {ride.destination.city}
          </Typography>
          <Typography className="text-muted-foreground text-sm">
            {ride.destination.address}
          </Typography>
        </div>
      </div>
    </div>
  );
};
