import { z } from "zod";

export const citySchema = z.object({
  label: z.string().min(1, "required"),
  name: z.string().min(1, "required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  coordinates: z.string().min(1, "required"),
});
