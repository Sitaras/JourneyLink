import HomePage from "@/components/HomePage/HomePage";
import { initLingui } from "@/lib/appRouterI18n";

interface HomePageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    departureDate?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  await initLingui();
  const params = await searchParams;

  return <HomePage searchParams={params} />;
}
