import { City, Country } from "@/types/location.types";
import apiService from "../api-service";

export const locationService = {
  getCountries: async () => {
    return await apiService.get<Country[]>(`locations/countries`);
  },
  getCitiesByCountry: async (countryId: number) => {
    return await apiService.get<City[]>(
      `locations/countries/${countryId}/cities`
    );
  },
};
