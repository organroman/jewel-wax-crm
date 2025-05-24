import { PersonRoleValue } from "./person.types";

export type Module =
  | "PERSONS"
  | "CONTACTS"
  | "REQUESTS"
  | "DASHBOARD"
  | "ORDERS"
  | "FINANCE"
  | "REPORTS"
  | "STATISTIC";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRoleValue[]>>;
