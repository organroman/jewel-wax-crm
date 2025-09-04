import { useQuery } from "@tanstack/react-query";
import { statisticService } from "./statistic-service";

export const useStatistic = {
  getStatistic: ({ query, enabled }: { query: string; enabled: boolean }) => {
    return useQuery({
      queryKey: ["statistic", query],
      queryFn: () => statisticService.get(query),
      enabled,
    });
  },
};
