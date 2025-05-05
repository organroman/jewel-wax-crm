export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export type SortOrder = "asc" | "desc";
