import { PersonRole } from "../constants/person-roles";

export type Module = "PERSONS";
export type Action = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Record<Module, Record<Action, PersonRole[]>>;
