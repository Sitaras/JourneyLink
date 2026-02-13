import HomePage, { type HomePageProps } from "@/components/HomePage/HomePage";
import { initLingui } from "@/lib/appRouterI18n";

export default async function Home({ searchParams }: HomePageProps) {
  await initLingui();
  const params = await searchParams;

  return <HomePage searchParams={params} />;
}
