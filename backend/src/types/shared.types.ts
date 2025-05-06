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
