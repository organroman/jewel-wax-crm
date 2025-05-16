import { useQuery } from "@tanstack/react-query";
import { locationService } from "./location-service";

export const useLocation = {
  getCitiesByCountryQuery: (countryId?: number) => ({
    queryKey: ["cities", countryId],
    queryFn: () => locationService.getCitiesByCountry(countryId!!),
    enabled: !!countryId,
  }),

  getCountries: () => {
    return useQuery({
      queryKey: ["countries"],
      queryFn: () => locationService.getCountries(),
    });
  },
  getCitiesByCountry: (countryId?: number) => {
    return useQuery({
      queryKey: ["cities", countryId],
      queryFn: () => locationService.getCitiesByCountry(countryId!!),
      enabled: !!countryId,
    });
  },
};
