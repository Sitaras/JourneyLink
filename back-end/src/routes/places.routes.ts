import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { cityAutocompleteSchema } from "../schemas/services/cityAutocompleteSchema";
import { PlacesController } from "../controllers/places.controller";

const router = Router();

router.post(
  "/city-autocomplete",
  validateData(cityAutocompleteSchema),
  // limiter,
  PlacesController.cityAutocomplete
);

export const placesRoutes = router;
