import { getRoutes, getRoute } from "@/api-actions/routes";
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
    const response = await getRoutes({ ...baseParams, page, limit });

    return {
      pageData: response.data ?? [],
      totalPages: response.pages ?? 1,
    };
  } catch (error) {
    return {
      pageData: [],
      totalPages: 1,
      error: "Failed to fetch routes",
    };
  }
}

export async function getRouteById(id: string) {
  if (!id) {
    return { data: null };
  }

  try {
    const response = await getRoute(id);

    return { data: response };
  } catch {
    return { data: null, error: "Failed to fetch route" };
  }
}
