import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUserInfo } from "@/api-actions/auth";
import HomeForm from "@/components/HomeForm/HomeForm";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["api/user"],
    queryFn: getUserInfo,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeForm />
    </HydrationBoundary>
  );
}
