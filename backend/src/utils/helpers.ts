import { AdminOrder, UserOrder } from "../types/orders.types";
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

export function getDoorAddress(
  street?: string | null,
  house?: string | null,
  flat?: string | null
): string {
  return [street, house, flat].filter(Boolean).join(" ,");
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

export function stripPrivateFields(
  order: AdminOrder | UserOrder,
  user_role: PersonRole
): Partial<AdminOrder | UserOrder> {
  const fieldsToRemove: Partial<Record<PersonRole, string[]>> = {
    modeller: [
      "customer_id",
      "miller_id",
      "printer_id",
      "modeller_id",
      "modeller_first_name",
      "modeller_last_name",
      "modeller_patronymic",
    ],
    miller: [
      "customer_id",
      "modeller_id",
      "printer_id",
      "miller_id",
      "miller_first_name",
      "miller_last_name",
      "miller_patronymic",
    ],
    super_admin: [
      "modeller_id",
      "miller_id",
      "printer_id",
      "customer_id",
      "modeller_first_name",
      "modeller_last_name",
      "modeller_patronymic",
      "miller_first_name",
      "miller_last_name",
      "miller_patronymic",
      "customer_first_name",
      "customer_last_name",
      "customer_patronymic",
      "printer_first_name",
      "printer_last_name",
      "printer_patronymic",
    ],
  };

  const omit = new Set(fieldsToRemove[user_role] || []);
  return Object.fromEntries(
    Object.entries(order).filter(([key]) => !omit.has(key))
  );
}

export function parseDate(input: string): Date {
  const [day, month, year] = input.split(".");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
