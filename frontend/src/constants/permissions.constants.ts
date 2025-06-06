import { PermissionMap } from "@/types/permission.types";
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
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller", "modeller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin", "miller", "modeller"],
  },
  ORDERS: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin"],
  },
  FINANCE: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller", "modeller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin", "miller", "modeller"],
  },
  REPORTS: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller", "modeller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin", "miller", "modeller"],
  },
  STATISTIC: {
    VIEW: ["super_admin", "miller", "modeller"],
    CREATE: ["super_admin", "miller", "modeller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin", "miller", "modeller"],
  },
} as const;

export const getColumnVisibilityByRole = (
  role: PersonRoleValue,
  query: string
) => {
  const includesModeling = query.includes("modeling");
  const includesMilling = query.includes("milling");
  const includesPrinting = query.includes("printing");

  return {
    is_favorite: true,
    is_important: true,
    created_at: true,
    number: true,
    image: true,
    name: true,
    customer: role === "super_admin",
    modeller: includesModeling,
    miller: includesMilling,
    printer: includesPrinting,
    amount: role === "super_admin",
    modeling_cost: role === "modeller",
    payment_status: role === "super_admin",
    active_stage: role === "super_admin",
    active_stage_status: role === "super_admin",
    specific_stage: role === "modeller" || role === "miller",
    specific_stage_status: role === "modeller" || role === "miller",
    processing_days: role === "super_admin",
    notes: role === "super_admin",
    actions: true,
  };
};
