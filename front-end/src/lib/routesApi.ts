import { getRoutes } from "@/api-actions/routes";
import type { IGetRoutesQueryPayload } from "@/schemas/routesSchema";
import { Route } from "@/types/routes";

export interface SearchRoutesResult {
  pageData: Route[];
  totalPages: number;
  error?: string;
}

export async function searchRoutes(
  baseParams: IGetRoutesQueryPayload,
  page = 1,
  limit = 3
): Promise<SearchRoutesResult> {
  if (!baseParams) {
    return { pageData: [], totalPages: 1 };
  }

  try {
    const result = await getRoutes({ ...baseParams, page, limit });

    return {
      pageData: result.data ?? [],
      totalPages: result.pages ?? 1,
    };
  } catch (error) {
    return {
      pageData: [],
      totalPages: 1,
      error: "Failed to fetch routes",
    };
  }
}
