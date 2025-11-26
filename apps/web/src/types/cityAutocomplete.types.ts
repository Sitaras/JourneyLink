type AutocompleteResult = {
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
  results: AutocompleteResult[];
  resultsCount: number;
  maxResults: number;
  query: string;
};
