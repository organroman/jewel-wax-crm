import { PermissionMap } from "../types/permission.types";

export const PERMISSIONS: PermissionMap = {
  PERSONS: {
    VIEW: ["super_admin"],
    CREATE: ["super_admin"],
    UPDATE: ["super_admin"],
    DELETE: ["super_admin"],
  },
} as const;
