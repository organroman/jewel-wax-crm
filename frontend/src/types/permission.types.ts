import { useOrderPermissions } from "@/hooks/use-order-permissions";
import { PersonRoleValue } from "./person.types";
import { Order } from "./order.types";

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
export type StagePermissionMap = {
  [stage: string]: {
    VIEW: PersonRoleValue[];
    UPDATE: PersonRoleValue[];
  };
};

export type FieldPermissionsMap = {
  [fieldName: string]: {
    VIEW: PersonRoleValue[];
    UPDATE: PersonRoleValue[];
    DELETE?: PersonRoleValue[];
  };
};

export type ExtraPermissionsMap = {
  [entityName: string]: {
    VIEW?: PersonRoleValue[];
    UPDATE?: PersonRoleValue[];
    DELETE?: PersonRoleValue[];
    CREATE?: PersonRoleValue[];
  };
};

export type DashboardFieldMap = {
  [entityName: string]: {
    VIEW: PersonRoleValue[];
  };
};

export type TabPermissionMap = Record<
  string,
  keyof ReturnType<typeof useOrderPermissions>
>;

export type PermissionCheck = (args: {
  role: PersonRoleValue;
  userId: number;
  order: Order;
}) => boolean;
