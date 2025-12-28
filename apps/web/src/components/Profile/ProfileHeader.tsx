import React from "react";
import { Star, UserRoundIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  rating?: {
    average?: number;
    count?: number;
  };
}

const ProfileHeader = ({ firstName, lastName, rating }: ProfileHeaderProps) => {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  const hasRating = !!rating?.average || !!rating?.count;

  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center p-6 gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/5">
            <UserRoundIcon className="h-8 w-8 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <Typography className="font-semibold text-lg break-words">
            {fullName || <Trans>User</Trans>}
          </Typography>
          {hasRating && (
            <div className="flex items-center gap-2 mt-1">
              {!!rating.average && (
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <Typography className="text-sm font-medium">
                    {rating.average}
                  </Typography>
                </div>
              )}
              {!!rating.count && (
                <Typography className="text-xs text-muted-foreground">
                  ({rating.count} <Trans>rides</Trans>)
                </Typography>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
