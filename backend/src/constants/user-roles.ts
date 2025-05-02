export const USER_ROLES = [
  "super_admin",
  "admin",
  "modeller",
  "miller",
] as const;

export type UserRole = (typeof USER_ROLES)[number];
