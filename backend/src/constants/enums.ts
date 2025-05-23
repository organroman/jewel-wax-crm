export const PERSON_ROLES = [
  "super_admin",
  "modeller",
  "miller",
  "client",
  "print",
] as const;

export const CONTACT_SOURCE = [
  "telegram",
  "viber",
  "facebook",
  "instagram",
  "whatsapp",
  "form",
  "manually",
] as const;

export const REQUEST_SOURCE = [
  "telegram",
  "viber",
  "facebook",
  "instagram",
  "whatsapp",
  "form",
  "manually",
] as const;

export const REQUEST_STATUS = ["new", "in_progress", "done", "canceled"] as const;
