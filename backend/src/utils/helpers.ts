
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