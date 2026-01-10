import { getQueryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import RideManagementClient from "./RideManagementClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

const RideManagement = async ({}: PageProps) => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RideManagementClient />
    </HydrationBoundary>
  );
};

export default RideManagement;
