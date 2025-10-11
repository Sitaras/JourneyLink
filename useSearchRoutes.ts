import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRoutes } from "@/api-actions/routes";
import type { IGetRoutesQueryPayload } from "@/schemas/routesSchema";
import { usePaginationSearchParams } from "./usePaginationSearchParams";

export function useSearchRoutes(baseParams?: IGetRoutesQueryPayload) {
  const [{ page, limit }, setPagination] = usePaginationSearchParams();
  
  // State to keep previous data until new data is fetched
  const [displayedPageData, setDisplayedPageData] = useState<any[]>([]);
  const [displayedPage, setDisplayedPage] = useState(page);

  const params = structuredClone(baseParams);

  if (params) {
    params.page = page;
    params.limit = limit;
  }
  console.log(baseParams);

  const query = useInfiniteQuery({
    queryKey: ["routes", params],
    initialPageParam: page,
    queryFn: async ({ pageParam }) => {
      if (!params) throw new Error("Missing query params");
      return getRoutes({ ...params, page: pageParam, limit });
    },
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.page < lastPage.pages
        ? lastPage.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage && firstPage.page > 1 ? firstPage.page - 1 : undefined,
    enabled: !!params,
  });

  const totalPages = query.data?.pages.at(-1)?.pages ?? 1;
  const currentPageData = query.data?.pages.find((p) => p.page === page)?.data ?? [];

  // Update displayed data only when new data is successfully fetched
  useEffect(() => {
    if (currentPageData.length > 0 && !query.isFetching) {
      setDisplayedPageData(currentPageData);
      setDisplayedPage(page);
    }
  }, [currentPageData, page, query.isFetching]);

  // Reset displayed data when params change (new search)
  useEffect(() => {
    if (baseParams) {
      setDisplayedPageData([]);
      setDisplayedPage(page);
    }
  }, [baseParams]);

  return {
    ...query,
    pageData: displayedPageData, // Use displayed data instead of current page data
    page: displayedPage, // Use displayed page instead of current page
    limit,
    totalPages,
    setPage: (newPage: number) => setPagination({ page: newPage }),
    goToPreviousPage: () => setPagination(({ page }) => ({ page: page - 1 })),
    goToNextPage: () => setPagination(({ page }) => ({ page: page + 1 })),
    setLimit: (newLimit: number) => setPagination({ limit: newLimit }),
  };
}