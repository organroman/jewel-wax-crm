import {
  City,
  Country,
  CreateCitySchema,
  CreateCountrySchema,
} from "@/types/location.types";

import { toast } from "sonner";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { locationService } from "./location-service";

export const useLocation = {
  getCountries: () => {
    return useQuery({
      queryKey: ["countries"],
      queryFn: () => locationService.getCountries(),
    });
  },
  getCitiesByCountry: (query: string, countryId?: number) => {
    return useQuery({
      queryKey: ["cities", countryId, query],
      queryFn: () => locationService.getCitiesByCountry(countryId!!, query),
      enabled: !!countryId,
    });
  },
  getCities: (query: string) => {
    return useQuery({
      queryKey: ["cities", query],
      queryFn: () => locationService.getAllCities(query),
    });
  },
  getCityById: ({ cityId, enabled }: { cityId: number; enabled: boolean }) => {
    return useQuery({
      queryKey: ["city", cityId],
      queryFn: () => locationService.getCityById(cityId),
      enabled,
    });
  },
  createCity: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: City) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<City, Error, CreateCitySchema>({
      mutationFn: async (data) => locationService.createCity(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.city_created"));
        queryClient.invalidateQueries({
          queryKey: ["cities"],
        });
        handleOnSuccess && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createCityMutation: mutation };
  },
  createCountry: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Country) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Country, Error, CreateCountrySchema>({
      mutationFn: async (data) => locationService.createCountry(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.country_created"));
        queryClient.invalidateQueries({
          queryKey: ["countries"],
        });
        handleOnSuccess && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createCountryMutation: mutation };
  },
};
