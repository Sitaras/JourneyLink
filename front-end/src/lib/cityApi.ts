import { cityAutocomplete } from "@/api-actions/cityAutocomplete";

export async function getCityAutocomplete(query: string) {
  if (!query || query.length <= 2) return [];
  try {
    const response = await cityAutocomplete({ query });
    return response;
  } catch (error) {
    return [];
  }
}
