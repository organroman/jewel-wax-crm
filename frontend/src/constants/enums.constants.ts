export const PERSON_ROLE_VALUES = [
  "client",
  "super_admin",
  "modeller",
  "miller",
  "print",
] as const;

export const ALLOWED_ROLES_FOR_CRM_USER = [
  "super_admin",
  "modeller",
  "miller",
] as const;

export const CHANEL_SOURCE = [
  "telegram",
  "viber",
  "facebook",
  "instagram",
  "whatsapp",
  "form",
  "manually",
] as const;

export const REQUEST_STATUS = [
  "new",
  "in_progress",
  "done",
  "canceled",
] as const;

export const PAYMENT_STATUS = ["paid", "unpaid", "partly_paid"] as const;
export const PAYMENT_METHOD = [
  "cash",
  "card_transfer",
  "payment_system",
  "bank_transfer",
] as const;

export const INVOICE_STATUS = ["paid", "pending"] as const;

export const ORDER_STAGE = [
  "new",
  "modeling",
  "milling",
  "printing",
  "delivery",
  "done",
] as const;

export const ORDER_STAGE_STATUS = [
  "pending",
  "processed",
  "in_process",
  "negotiation",
  "clarification",
  "done",
] as const;

export const DELIVERY_TYPE = ["warehouse", "door"] as const;
