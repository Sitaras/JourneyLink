"use server";
import { CityAutocompleteResponse } from "@/types/cityAutocomplete.types";
import { api } from "./api";
import { cityAutocompleteSchema } from "@/schemas/home/cityAutocompleteSchema";
import z from "zod";

type CityAutocompleteValues = z.infer<typeof cityAutocompleteSchema>;

export const cityAutocomplete = async (body: CityAutocompleteValues) => {
  const response = await api
    .url("city-autocomplete")
    .post(body)
    .json<CityAutocompleteResponse["results"]>((json) => json?.data?.results);

  return response;
};
