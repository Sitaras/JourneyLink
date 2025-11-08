import { getRides, getRide } from "@/api-actions/ride";
import type { IGetRidesQueryPayload } from "@/schemas/rideSchema";
import { Ride } from "@/types/rides.types";

export interface SearchRidesResult {
  pageData: Ride[];
  totalPages: number;
  error?: string;
}

export async function searchRides(
  baseParams: IGetRidesQueryPayload,
  page = 1,
  limit = 3
): Promise<SearchRidesResult> {
  if (!baseParams) {
    return { pageData: [], totalPages: 1 };
  }

  try {
    const response = await getRides({ ...baseParams, page, limit });

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
