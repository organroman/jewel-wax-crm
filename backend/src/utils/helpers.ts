import { PersonRole } from "../types/person.types";

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



export function getFullName(
  first?: string,
  last?: string,
  patronymic?: string
): string {
  return [first, patronymic, last].filter(Boolean).join(" ");
}

export function formatPerson(row: any, prefix: string) {
  const id = row[`${prefix}_id`];
  if (!id) return null;
  return {
    id,
    fullname: getFullName(
      row[`${prefix}_last_name`],
      row[`${prefix}_first_name`],
      row[`${prefix}_patronymic`]
    ),
  };
}

export function getVisibleFieldsForRoleAndContext(role: PersonRole): string[] {
  return [
    "id",
    "number",
    "name",
    "created_at",
    "is_important",
    ...(role === "super_admin"
      ? [
          "customer_id",
          "miller_id",
          "printer_id",
          "modeller_id",
          "amount",
          "payment_status",
          "active_stage",
          "processing_days",
          "notes",
        ]
      : []),
    ...(role === "modeller" ? ["modeller_id", "modeling_cost"] : []),
    ...(role === "miller" ? ["miller_id", "milling_cost"] : []),
  ];
}
