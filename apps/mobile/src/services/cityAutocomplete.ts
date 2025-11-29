import { api } from './api';



export interface CityAutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export const cityAutocompleteService = {
  getPredictions: async (input: string) => {
    return api
      .url('/city-autocomplete')
      .post({ input })
      .json<CityAutocompleteResult[]>((json) => json?.data?.results);
  },
};
