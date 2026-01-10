import { getQueryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import UserProfileClient from "./UserProfileClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

const UserProfile = async ({}: PageProps) => {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileClient />
    </HydrationBoundary>
  );
};

export default UserProfile;
