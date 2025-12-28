"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import UserRidesList from "@/components/UserRidesList/UserRidesList";
import { Car, User } from "lucide-react";
import { Trans } from "@lingui/react/macro";
import { UserRideRole } from "@journey-link/shared";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

const MyRidesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const viewParam = searchParams.get("view");
  const activeTab =
    viewParam === "driver" ? UserRideRole.AS_DRIVER : UserRideRole.AS_PASSENGER;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleTabChange = (value: string) => {
    const viewValue = value === UserRideRole.AS_DRIVER ? "driver" : "passenger";
    router.push(pathname + "?" + createQueryString("view", viewValue));
  };

  const tabs = [
    {
      name: <Trans>As Passenger</Trans>,
      value: UserRideRole.AS_PASSENGER,
      icon: User,
      description: <Trans>Rides you&apos;ve booked</Trans>,
    },
    {
      name: <Trans>As Driver</Trans>,
      value: UserRideRole.AS_DRIVER,
      icon: Car,
      description: <Trans>Rides you&apos;re offering</Trans>,
    },
  ];

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-8 max-w-4xl w-full">
        <div className="flex flex-col gap-2">
          <Typography variant="h2">
            <Trans>My Rides</Trans>
          </Typography>
          <Typography className="text-muted-foreground">
            <Trans>Manage your upcoming and past journeys</Trans>
          </Typography>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full p-0 border-b rounded-none bg-transparent h-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary py-4 px-6 gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    <Typography className="font-medium">{tab.name}</Typography>
                  </span>
                  <span className="sm:hidden">
                    <Typography className="font-medium">
                      {tab.value === UserRideRole.AS_PASSENGER ? (
                        <Trans>Passenger</Trans>
                      ) : (
                        <Trans>Driver</Trans>
                      )}
                    </Typography>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <div className="mb-4">
                <Typography className="text-sm text-muted-foreground">
                  {tab.description}
                </Typography>
              </div>
              <UserRidesList type={tab.value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default MyRidesPage;
