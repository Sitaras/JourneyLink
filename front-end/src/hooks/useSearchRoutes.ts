import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRoutes } from "@/api-actions/routes";
import type { IGetRoutesQueryPayload } from "@/schemas/routesSchema";
import { usePaginationSearchParams } from "./usePaginationSearchParams";
import { useMemo } from "react";

export function useSearchRoutes(baseParams?: IGetRoutesQueryPayload) {
  const [{ page, limit }, setPagination] = usePaginationSearchParams();

  const params = useMemo(() => structuredClone(baseParams), [baseParams]);

  const query = useQuery({
    queryKey: ["routes", params, page, limit],
    queryFn: async () => {
      if (!params) throw new Error("Missing query params");
      return getRoutes({ ...params, page, limit });
    },
    enabled: !!params,
    placeholderData: keepPreviousData,
  });

  const totalPages = query.data?.pages ?? 1;
  const pageData = query.data?.data ?? [];

  return {
    ...query,
    pageData,
    page,
    limit,
    totalPages,
    setPage: (newPage: number) => setPagination({ page: newPage }),
    handlePrevious: () => {
      if (page > 1) setPagination(({ page }) => ({ page: page - 1 }));
    },
    handleNext: () => {
      if (page < totalPages) setPagination(({ page }) => ({ page: page + 1 }));
    },
    setLimit: (newLimit: number) => setPagination({ limit: newLimit }),
  };
}
