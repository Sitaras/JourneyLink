import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const EditRideDialogSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-3 bg-muted/50 rounded-md space-y-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="ml-[5px] w-0.5 h-4 bg-border" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
