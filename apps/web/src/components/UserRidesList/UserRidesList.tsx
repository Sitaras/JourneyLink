import React from "react";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { MapPin, AlertCircle } from "lucide-react";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "@/components/LoadingState/LoadingState";
import RideCard from "@/components/RideCard/RideCard";
import { UserRideRole } from "@/types/user.types";
import { UserRide } from "@journey-link/shared";
import { useRouter } from "next/navigation";
import { routes } from "@/configs/routes";
import { useUserRidesInfinite } from "@/hooks/queries/useUserQuery";

type RidesListProps = {
  type: UserRideRole;
  className?: string;
};

const UserRidesList = ({ type, className }: RidesListProps) => {
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useUserRidesInfinite(type);

  const ref = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleEdit = (ride: UserRide) => {
    router.push(`${routes.myRides}/${ride._id}/edit`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="shadow-sm w-full border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div className="text-center">
            <Typography className="font-semibold text-lg mb-1">
              Failed to load rides
            </Typography>
            <Typography className="text-muted-foreground text-sm">
              Please try again later
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRides =
    data?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0;

  if (totalRides === 0) {
    return (
      <Card className="shadow-sm w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <MapPin className="w-12 h-12 text-muted-foreground/50" />
          <div className="text-center">
            <Typography className="font-semibold text-lg mb-1">
              No rides yet
            </Typography>
            <Typography className="text-muted-foreground text-sm">
              {type === UserRideRole.AS_PASSENGER
                ? "You haven't booked any rides as a passenger"
                : "You haven't created any rides as a driver"}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <section className={cn("space-y-4", className)}>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                viewType={type}
                buttonLabel="View details"
                onEdit={
                  type === UserRideRole.AS_DRIVER ? handleEdit : undefined
                }
              />
            ))}
          </React.Fragment>
        ))}
        {(hasNextPage || isFetchingNextPage) && (
          <div ref={ref}>
            <LoadingState />
          </div>
        )}
      </section>
    </>
  );
};

export default UserRidesList;
