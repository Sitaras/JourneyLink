import { getQueryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import EditRideClient from "./EditRideClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EditRidePage = async ({}: PageProps) => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditRideClient />
    </HydrationBoundary>
  );
};

export default EditRidePage;
