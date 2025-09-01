import {
  DashboardFieldMap,
  ExtraPermissionsMap,
  FieldPermissionsMap,
  PermissionMap,
  StagePermissionMap,
} from "@/types/permission.types";
import { PersonRoleValue } from "@/types/person.types";

export const PERMISSIONS: PermissionMap = {
  PERSONS: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
  CONTACTS: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
  REQUESTS: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
  DASHBOARD: {
    VIEW: ["super_admin", "modeller"],
    CREATE: ["super_admin", "modeller"],
    UPDATE: ["super_admin", "modeller"],
    DELETE: ["super_admin", "modeller"],
  },
  ORDERS: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin"],
  },
  FINANCE: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
  REPORTS: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
  STATISTIC: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
} as const;

export const ORDER_FIELD_PERMISSIONS: FieldPermissionsMap = {
  number: {
    VIEW: ["super_admin", "modeller", "miller", "print"],
    UPDATE: ["super_admin"],
  },
  name: {
    VIEW: ["super_admin", "modeller", "miller", "print"],
    UPDATE: ["super_admin", "modeller", "miller", "print"],
  },
  description: {
    VIEW: ["super_admin", "modeller", "miller", "print"],
    UPDATE: ["super_admin", "modeller", "miller", "print"],
  },
  amount: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
  modeller: {
    VIEW: ["super_admin", "modeller"],
    UPDATE: ["super_admin"],
  },
  modeling_cost: {
    VIEW: ["super_admin", "modeller"],
    UPDATE: ["super_admin"],
  },
  miller: {
    VIEW: ["super_admin", "miller"],
    UPDATE: ["super_admin"],
  },
  milling_cost: {
    VIEW: ["super_admin", "miller"],
    UPDATE: ["super_admin"],
  },
  printer: {
    VIEW: ["super_admin", "print"],
    UPDATE: ["super_admin"],
  },
  printing_cost: {
    VIEW: ["super_admin", "print"],
    UPDATE: ["super_admin"],
  },
  delivery: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
  notes: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
  customer: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
  active_stage: {
    VIEW: ["super_admin", "miller", "modeller", "print"],
    UPDATE: ["super_admin"],
  },
  linked_orders: {
    VIEW: ["super_admin", "miller", "modeller", "print"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
};

export const ORDER_STAGE_PERMISSIONS: StagePermissionMap = {
  new: {
    VIEW: ["super_admin", "modeller", "miller", "print"],
    UPDATE: ["super_admin"],
  },
  modeling: {
    VIEW: ["super_admin", "modeller"],
    UPDATE: ["super_admin", "modeller"],
  },
  milling: {
    VIEW: ["super_admin", "miller"],
    UPDATE: ["super_admin", "miller"],
  },
  printing: {
    VIEW: ["super_admin", "print"],
    UPDATE: ["super_admin", "print"],
  },
  delivery: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
  done: {
    VIEW: ["super_admin"],
    UPDATE: ["super_admin"],
  },
};

export const ORDER_EXTRA_PERMISSIONS: ExtraPermissionsMap = {
  payments: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
  },
  important: {
    VIEW: ["super_admin", "miller", "modeller", "print"],
    UPDATE: ["super_admin"],
  },
  chat: {
    VIEW: ["super_admin", "modeller"],
    DELETE: ["super_admin"],
  },
  changes_history: {
    VIEW: ["super_admin"],
  },
  order: {
    VIEW: ["super_admin", "miller", "modeller", "print"],
    DELETE: ["super_admin"],
  },
  customer: {
    VIEW: ["super_admin"],
  },
  media: {
    VIEW: ["super_admin", "miller", "modeller", "print"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
    CREATE: ["super_admin", "miller", "modeller", "print"],
  },
};

export const DASHBOARD_PERMISSIONS: DashboardFieldMap = {
  totalOrders: {
    VIEW: ["super_admin", "modeller"],
  },
  totalModeling: {
    VIEW: ["super_admin", "modeller"],
  },

  modellersCounts: {
    VIEW: ["super_admin", "modeller"],
  },
  stagesStatusCount: {
    VIEW: ["super_admin", "modeller"],
  },
  totalProblemOrders: {
    VIEW: ["super_admin", "modeller"],
  },
  totalImportantOrders: {
    VIEW: ["super_admin", "modeller"],
  },
  totalFavoriteOrders: {
    VIEW: ["super_admin", "modeller"],
  },
  totalModelingPaymentsAmountByStatus: {
    VIEW: ["super_admin", "modeller"],
  },
  totalMilling: {
    VIEW: ["super_admin"],
  },
  totalPrinting: {
    VIEW: ["super_admin"],
  },
  totalDelivery: {
    VIEW: ["super_admin"],
  },
  financialIndicators: {
    VIEW: ["super_admin"],
  },
  requests: {
    VIEW: ["super_admin"],
  },
};

export function canViewField({
  field,
  role,
}: {
  field: string;
  role: PersonRoleValue;
}) {
  const fieldPermission = DASHBOARD_PERMISSIONS[field];
  return fieldPermission ? fieldPermission.VIEW.includes(role) : true;
}
