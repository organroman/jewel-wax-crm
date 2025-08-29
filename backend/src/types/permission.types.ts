import { PersonRole } from "./person.types";

export type Module =
  | "PERSONS"
  | "PERSON"
  | "CONTACTS"
  | "REQUESTS"
  | "ORDERS"
  | "CHAT"
  | "INVOICES"
  | "EXPENSES"
  | "CLIENT_REPORT"
  | "MODELING_REPORT"
  | "ORDERS_REPORT"
  | "EXPENSES_REPORT"
  | "FINANCE_REPORT"
  | "DASHBOARD";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRole[]>>;
