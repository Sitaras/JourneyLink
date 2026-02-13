"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";
import { ArrowRight, MapPin } from "lucide-react";
import { usePopularTrips } from "@/hooks/queries/useRideQuery";

export default function PopularTrips() {
  const { data: trips } = usePopularTrips();

  if (!trips || trips.length === 0) return null;

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h2" className="text-2xl font-bold">
          <Trans>Popular Trips</Trans>
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trips.map((trip, index) => (
          <Link
            key={index}
            href={`/?from=${encodeURIComponent(
              trip.origin
            )}&to=${encodeURIComponent(trip.destination)}&sortBy=departureTime&sortOrder=asc&page=1`}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group-hover:border-primary/50">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Popular Route</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lg font-semibold group-hover:text-primary transition-colors">
                    <span>{trip.origin}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                    <span>{trip.destination}</span>
                  </div>
                  <Typography className="text-sm text-muted-foreground">
                    <Trans>
                      {trip.count} rides available • from €{trip.minPrice}
                    </Trans>
                  </Typography>
                </div>

                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
