import { useQuery } from "@tanstack/react-query";
import { enumService } from "./enum-service";

export const useEnums = {
  getEnum: (type: string) => {
    return useQuery({
      queryKey: ["enums", type],
      queryFn: () => enumService.getEnum(type),
      staleTime: 1000 * 60 * 30, 
      enabled: !!type,
    });
  },
  getAllEnums: () => {
    return useQuery({
      queryKey: ["enums"],
      queryFn: () => enumService.getEnums(),
    });
  },
};
