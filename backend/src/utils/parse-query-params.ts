export function parseNumberArray(param: unknown): number[] | undefined {
  if (typeof param === "string") {
    return param
      .split(",")
      .map((i) => Number(i.trim()))
      .filter((n) => !isNaN(n));
  }
  return undefined;
}

export function parseBooleanArray(param: unknown): boolean[] | undefined {
  if (typeof param === "string") {
    return param.split(",").map((i) => i.trim() === "true");
  }
  return undefined;
}

export function parseStringArray<T = string>(param: unknown): T[] | undefined {
  if (typeof param === "string") {
    return param.split(",").map((i) => i.trim()) as T[];
  }
  return undefined;
}

export type SortDirection = "asc" | "desc";

export function parseSortParams<T extends readonly string[]>(
  sortByRaw: string | undefined,
  orderRaw: string | undefined,
  allowedFields: T,
  defaultSortBy: T[number]
): { sortBy: T[number]; order: SortDirection } {
  const sortBy = allowedFields.includes(sortByRaw as T[number])
    ? (sortByRaw as T[number])
    : defaultSortBy;

  const order: SortDirection =
    orderRaw === "asc" || orderRaw === "desc" ? orderRaw : "desc";

  return { sortBy, order };
}
