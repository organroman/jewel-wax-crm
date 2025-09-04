import { Statistic } from "@/types/statistic.types";
import apiService from "../api-service";

export const statisticService = {
  get: async (query: string) => {
    return await apiService.get<Statistic>(`statistic?${query}`);
  },
};
