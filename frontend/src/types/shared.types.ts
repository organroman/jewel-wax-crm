import { CHANEL_SOURCE } from "@/constants/enums.constants";

export type ChanelSource = (typeof CHANEL_SOURCE)[number];

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export type SortOrder = "asc" | "desc";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: SortOrder;
}

export interface GetAllOptions<TFilters = Record<string, any>> {
  page?: number;
  limit?: number;
  filters?: TFilters;
  search?: string;
  sortBy?: string;
  order?: SortOrder;
}

export interface EnumItem {
  value: string;
  label: string;
  type: string;
}

export interface FilterOption {
  label: string;
  value: string | boolean;
}

export interface FilterGroup {
  label: string;
  param: string;
  options: FilterOption[];
}
