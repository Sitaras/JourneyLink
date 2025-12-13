import { getRides, getRide } from "@/api-actions/ride";
import { IGetRideQueryInput, Ride } from "@journey-link/shared";

export interface SearchRidesResult {
  pageData: Ride[];
  totalPages: number;
  error?: string;
}

export async function searchRides(
  baseParams: IGetRideQueryInput,
  page = 1,
  limit = 3
): Promise<SearchRidesResult> {
  if (!baseParams) {
    return { pageData: [], totalPages: 1 };
  }

  try {
    const response = await getRides({
      ...baseParams,
      page: page.toString(),
      limit: limit.toString(),
    });

    return {
      pageData: response.data ?? [],
      totalPages: response.pages ?? 1,
    };
  } catch (error) {
    return {
      pageData: [],
      totalPages: 1,
      error: "Failed to fetch rides",
    };
  }
}

export async function getRideById(id: string) {
  if (!id) {
    return { data: null };
  }

  try {
    const response = await getRide(id);

    return { data: response };
  } catch {
    return { data: null, error: "Failed to fetch ride" };
  }
}
