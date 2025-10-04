import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import HomeForm from "@/components/HomeForm/HomeForm";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["whatever"],
    queryFn: () => {
      return "whatever";
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeForm />
    </HydrationBoundary>
  );
}
