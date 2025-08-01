import { PersonRole } from "./person.types";

export type Module =
  | "PERSONS"
  | "CONTACTS"
  | "REQUESTS"
  | "ORDERS"
  | "CHAT"
  | "INVOICES"
  | "EXPENSES";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRole[]>>;
