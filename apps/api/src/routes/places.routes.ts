import { Router } from "express";
import { placesController } from "../controllers/places.controller";

const router = Router();

router.post("/city-autocomplete", placesController.cityAutocomplete);

export default router;
