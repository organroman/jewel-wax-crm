import { useQuery } from "@tanstack/react-query";
import { locationService } from "./location-service";

export const useLocation = {
  getCountries: () => {
    return useQuery({
      queryKey: ["countries"],
      queryFn: () => locationService.getCountries(),
    });
  },
  getCitiesByCountry: ({ countryId }: { countryId: number }) => {
    return useQuery({
      queryKey: ["cities", countryId],
      queryFn: () => locationService.getCitiesByCountry(countryId),
    });
  },
};
