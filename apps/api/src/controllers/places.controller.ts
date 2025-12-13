import { Request, Response } from "express";
import { ICityAutoCompletePayload } from "../types/services/cityAutocomplete.types";
import { PlacesService, placesService } from "../services/places.service";

export class PlacesController {
  constructor(private placesService: PlacesService) {}

  cityAutocomplete = async (
    req: Request<unknown, unknown, ICityAutoCompletePayload>,
    res: Response,
    next: any
  ) => {
    const { query, maxResults, language } = req.body;
    try {
      const data = await this.placesService.cityAutocomplete(
        query,
        maxResults,
        language
      );

      res.success(data);
    } catch (error) {
      next(error);
    }
  };
}

export const placesController = new PlacesController(placesService);
