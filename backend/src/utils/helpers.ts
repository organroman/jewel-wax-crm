export const formatLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

export function stripPassword<T extends { password?: string }>(person: T) {
  const { password, ...safe } = person;
  return safe;
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

export function getFullName(
  firstName: string,
  lastName: string,
  surname: string | undefined
) {
  let fullname = lastName + " " + firstName;

  if (surname) {
    fullname = fullname + " " + surname;
  }

  return fullname;
}
