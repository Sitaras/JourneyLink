"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfileById } from "@/api-actions/user";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import Typography from "@/components/ui/typography";
import PageLoader from "@/components/PageLoader/PageLoader";
import { Calendar, Mail, Phone, Star, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
import { Facebook, Linkedin, Twitter } from "lucide-react";

const ensureProtocol = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const UserProfile = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["users", userId, "profile"],
    queryFn: () => getUserProfileById(userId as string),
    enabled: !!userId,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <User className="w-16 h-16 text-muted-foreground/50" />
        <Typography variant="h3">Profile Unavailable</Typography>
        <Typography className="text-muted-foreground text-center max-w-md">
          We couldn&apos;t find this profile. It may not exist, or you might not
          have permission to view it. Profiles are only visible between users
          with confirmed rides.
        </Typography>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-2"
        >
          Go back
        </Button>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    bio,
    rating,
    socials,
  } = data;

  const fullName = `${firstName} ${lastName}`;
  const averageRating = rating?.average || 0;
  const ratingCount = rating?.count || 0;

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="w-full">
          <BackButton />
        </div>
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <CardHeader className="flex flex-col items-center gap-4 pb-2">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <Typography variant="h2" className="text-3xl font-bold">
                {fullName}
              </Typography>
              <div className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bio ? (
                <Typography className="leading-relaxed whitespace-pre-wrap">
                  {bio}
                </Typography>
              ) : (
                <Typography className="text-muted-foreground italic">
                  No bio provided.
                </Typography>
              )}
            </CardContent>
          </Card>

          {(email || phoneNumber || dateOfBirth) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-background border">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-muted-foreground font-medium">
                        Email
                      </span>
                      <span className="font-medium truncate" title={email}>
                        {email}
                      </span>
                    </div>
                  </div>
                )}
                {phoneNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-background border">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">
                        Phone
                      </span>
                      <span className="font-medium">{phoneNumber}</span>
                    </div>
                  </div>
                )}
                {dateOfBirth && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-background border">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">
                        Born
                      </span>
                      <span className="font-medium">
                        {formatDate(dateOfBirth, DateFormats.DATE_SLASH_FORMAT)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {socials && Object.values(socials).some((s) => s) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {socials.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={ensureProtocol(socials.facebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Facebook className="w-4 h-4 text-[#1877F2]" />
                        Facebook
                      </Link>
                    </Button>
                  )}
                  {socials.linkedIn && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={ensureProtocol(socials.linkedIn)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                        LinkedIn
                      </Link>
                    </Button>
                  )}
                  {socials.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={ensureProtocol(socials.twitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                        Twitter
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Typography className="text-xs text-center text-muted-foreground mt-4">
            Contact details and social links are only visible because you have a
            confirmed ride with this user.
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
