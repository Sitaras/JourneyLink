"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { useState } from "react";
import UserRidesList from "@/components/UserRidesList/UserRidesList";
import { Car, User } from "lucide-react";
import { UserRideRole } from "@journey-link/shared";

const MyRidesPage = () => {
  const [activeTab, setActiveTab] = useState<UserRideRole>(
    UserRideRole.AS_PASSENGER
  );

  const tabs = [
    {
      name: "As Passenger",
      value: UserRideRole.AS_PASSENGER,
      icon: User,
      description: "Rides you've booked",
    },
    {
      name: "As Driver",
      value: UserRideRole.AS_DRIVER,
      icon: Car,
      description: "Rides you're offering",
    },
  ];

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-8 max-w-4xl w-full">
        <div className="flex flex-col gap-2">
          <Typography variant="h2">My Rides</Typography>
          <Typography className="text-muted-foreground">
            Manage your upcoming and past journeys
          </Typography>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as UserRideRole)}
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
                      {tab.value === UserRideRole.AS_PASSENGER
                        ? "Passenger"
                        : "Driver"}
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
