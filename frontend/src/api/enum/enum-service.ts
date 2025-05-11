import { EnumItem } from "@/types/shared.types";
import apiService from "../api-service";

export const enumService = {
  getEnum: (type: string) => apiService.get<EnumItem[]>(`enums/${type}`),
  getEnums: () => apiService.get<Record<string, EnumItem[]>>("enums"),
};
