import HomePage from "@/components/HomePage/HomePage";

interface HomePageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    departureDate?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  return <HomePage searchParams={params} />;
}
