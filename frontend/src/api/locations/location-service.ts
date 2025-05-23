import {
  City,
  Country,
  CreateCitySchema,
  CreateCountrySchema,
} from "@/types/location.types";
import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";

export const locationService = {
  getCountries: async () => {
    return await apiService.get<Country[]>(`locations/countries`);
  },
  getCitiesByCountry: async (countryId: number) => {
    return await apiService.get<City[]>(
      `locations/countries/${countryId}/cities`
    );
  },
  getAllCities: async (query: string) => {
    return await apiService.get<PaginatedResult<City>>(
      `locations/cities?${query}`
    );
  },
  createCity: async (data: CreateCitySchema) => {
    return await apiService.post<City>("locations/cities", data);
  },
  createCountry: async (data: CreateCountrySchema) => {
    return await apiService.post<Country>("locations/countries", data);
  },
};
