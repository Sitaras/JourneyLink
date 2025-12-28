import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";
import { Card, CardContent } from "@/components/ui/card";

interface LayoutProps {
  limit?: number;
  page?: number;
  totalPages?: number;
  hasResults?: boolean;
  isInitialLoad?: boolean;
  searchForm: React.ReactNode;
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
  searchResults,
  pagination,
}: LayoutProps) {
  return (
    <section className="flex flex-col gap-8 items-center w-full max-xl:max-w-3xl max-lg:max-w-lg max-w-5xl">
      {/* Hero Section - Only show on initial load */}
      {isInitialLoad && (
        <div className="w-full max-w-4xl text-center space-y-4 mb-4">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            <Trans>Find Your Perfect Ride</Trans>
          </Typography>
          <Typography className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <Trans>
              Connect with drivers heading your way. Share the journey, split
              the costs, and travel sustainably.
            </Trans>
          </Typography>
        </div>
      )}

      {searchForm}

      {/* Results Section */}
      {!isInitialLoad && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {/* Results Header */}
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
          </div>

          {/* Rides List */}
          {searchResults}

          {/* Pagination */}
          {pagination}
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
