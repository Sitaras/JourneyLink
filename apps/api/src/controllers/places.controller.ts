import { Request, Response } from "express";
import { cityAutocomplete } from "../services/cityAutocomplete";
import { ICityAutoCompletePayload } from "../types/services/cityAutocomplete.types";

export class PlacesController {
  static async cityAutocomplete(
    req: Request<unknown, unknown, ICityAutoCompletePayload>,
    res: Response
  ) {
    const { query, maxResults, language } = req.body;
    try {
      const data = await cityAutocomplete(query, maxResults, language);

      res.success(data);
    } catch (error) {
      res.error("An error occurred", 500);
    }
  }
}
