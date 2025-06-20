import {
  City,
  Country,
  CreateCitySchema,
  CreateCountrySchema,
  Street,
  Warehouse,
} from "@/types/location.types";
import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";

export const locationService = {
  getCountries: async () => {
    return await apiService.get<Country[]>(`locations/countries`);
  },
  
  getCitiesByCountry: async (countryId: number, query: string) => {
    return await apiService.get<PaginatedResult<City>>(
      `locations/countries/${countryId}/cities?${query}`
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
  
  getCityById: async (cityId: number) => {
    return await apiService.get<City>(`locations/cities/${cityId}`);
  },

  getNPStreets: async (cityRef?: string, query?: string) => {
    return await apiService.get<Street[]>(
      `np/cities/${cityRef}/streets?${query}`
    );
  },
  getNPWarehouses: async (query: string) => {
    return await apiService.get<Warehouse[]>(`np/warehouses?${query}`);
  },
};
