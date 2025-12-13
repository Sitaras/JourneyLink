import wretch from "wretch";
import { config } from "../config/config";

export class PlacesService {
  async cityAutocomplete(
    query: string,
    maxResults: number = 5,
    language: string = "en"
  ) {
    return wretch("https://api.placekit.co/")
      .url("search")
      .headers({
        "x-placekit-api-key": config.placeKitApiKey,
      })
      .post({
        types: ["city"],
        maxResults,
        language,
        countries: ["gr"],
        query,
      })
      .json((json) => json);
  }
}

export const placesService = new PlacesService();
