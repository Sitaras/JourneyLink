import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { MapPin, AlertCircle } from "lucide-react";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "@/components/LoadingState/LoadingState";
import RideCard from "@/components/RideCard/RideCard";
import { fetchRides } from "@/mock/rides";

interface RidesListProps {
  type: "passenger" | "driver";
  className?: string;
}

const RidesList = ({ type, className }: RidesListProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["my-rides", type],
    queryFn: ({ pageParam }) => fetchRides(pageParam, type),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  const ref = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

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
    data?.pages.reduce((acc, page) => acc + page.rides.length, 0) ?? 0;

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
              {type === "passenger"
                ? "You haven't booked any rides as a passenger"
                : "You haven't created any rides as a driver"}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              viewType={type}
              buttonLabel="View details"
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
  );
};

export default RidesList;
