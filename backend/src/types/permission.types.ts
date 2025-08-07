import { PersonRole } from "./person.types";

export type Module =
  | "PERSONS"
  | "CONTACTS"
  | "REQUESTS"
  | "ORDERS"
  | "CHAT"
  | "INVOICES"
  | "EXPENSES"
  | "CLIENT_REPORT"
  | "MODELING_REPORT"
  | "ORDERS_REPORT"
  | "EXPENSES_REPORT";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRole[]>>;
