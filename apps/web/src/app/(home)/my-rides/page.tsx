import { getQueryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import MyRidesClient from "./MyRidesClient";

type PageProps = {
  searchParams: Promise<{ view?: string }>;
};

const MyRidesPage = async ({}: PageProps) => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyRidesClient />
    </HydrationBoundary>
  );
};

export default MyRidesPage;
