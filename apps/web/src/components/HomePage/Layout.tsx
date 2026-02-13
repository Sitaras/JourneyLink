import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";
import { Card, CardContent } from "@/components/ui/card";
import { MobileFilters } from "./MobileFilters";
import HeroSection from "./HeroSection";
import PopularTrips from "./PopularTrips";
import FaqSection from "./FaqSection";

interface LayoutProps {
  limit?: number;
  page?: number;
  totalPages?: number;
  hasResults?: boolean;
  isInitialLoad?: boolean;
  searchForm: React.ReactNode;
  filters?: React.ReactNode;
  searchResults?: React.ReactNode;
  pagination?: React.ReactNode;
}

export default async function Layout({
  limit,
  page,
  totalPages,
  hasResults,
  isInitialLoad,
  searchForm,
  filters,
  searchResults,
  pagination,
}: LayoutProps) {
  return (
    <section className="flex flex-col gap-8 items-center w-full max-xl:max-w-3xl max-lg:max-w-lg max-w-5xl">
      {isInitialLoad && <HeroSection />}

      {searchForm}

      {isInitialLoad && (
        <div className="w-full space-y-16 mt-8">
          <PopularTrips />
          <FaqSection />
        </div>
      )}

      {!isInitialLoad && (
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          <aside className="hidden lg:block">{filters}</aside>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <Typography variant="h2" className="text-2xl font-bold">
                  <Trans>Available Rides</Trans>
                </Typography>
                {hasResults && (
                  <Typography className="text-sm text-muted-foreground mt-1">
                    <Trans>
                      Showing {limit} ride(s) • Page {page} of {totalPages}
                    </Trans>
                  </Typography>
                )}
              </div>
              <div className="lg:hidden">
                <MobileFilters>{filters}</MobileFilters>
              </div>
            </div>

            {searchResults}

            {pagination}
          </div>
        </div>
      )}

      {/* CTA Section - Only show on initial load */}
      {isInitialLoad && (
        <div className="w-full max-w-4xl mt-8">
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <Typography variant="h3" className="text-2xl font-bold">
                <Trans>Have a car? Offer a ride!</Trans>
              </Typography>
              <Typography className="text-muted-foreground max-w-xl mx-auto">
                <Trans>
                  Turn your empty seats into extra income while helping others
                  travel affordably and sustainably.
                </Trans>
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
