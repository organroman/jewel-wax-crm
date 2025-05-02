export const PERSON_ROLES = [
  "super_admin",
  "admin",
  "modeller",
  "miller",
  "client",
  "lead",
  "print"
] as const;

export type PersonRole = (typeof PERSON_ROLES)[number];
