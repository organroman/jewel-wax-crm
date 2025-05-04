import { PermissionMap } from "../types/permission.types"


export const PERMISSIONS: PermissionMap = {
  PERSONS: {
    VIEW: ["admin", "super_admin", "miller"],
    CREATE: ["super_admin", "admin"],
    UPDATE: ["admin", "super_admin", "miller"],
    DELETE: ["super_admin"],
  },
} as const ;
