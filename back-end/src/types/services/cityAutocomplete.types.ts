import { cityAutocompleteSchema } from "@/schemas/services/cityAutocompleteSchema";
import { z } from "zod";

type SearchResult = {
  highlight: string;
  name: string;
  city: string;
  county: string;
  administrative: string;
  country: string;
  administrativecode: string;
  citycode: string;
  countrycode: string;
  countycode: string;
  zipcode: string[];
  population: number;
  lat: number;
  lng: number;
  coordinates: string;
  type: string;
};

export type CityAutocompleteResponse = {
  results: SearchResult[];
  resultsCount: number;
  maxResults: number;
  query: string;
};


export type ICityAutoCompletePayload = z.infer<typeof cityAutocompleteSchema>;
