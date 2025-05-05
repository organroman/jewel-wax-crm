import { PersonRole } from "./person.types";

export type Module = "PERSONS" | "CONTACTS";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRole[]>>;
