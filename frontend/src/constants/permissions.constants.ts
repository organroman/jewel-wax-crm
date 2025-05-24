import { PermissionMap } from "@/types/permission.types";

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
    CREATE: ["super_admin", "miller", "modeller"],
    UPDATE: ["super_admin", "miller", "modeller"],
    DELETE: ["super_admin", "miller", "modeller"],
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
