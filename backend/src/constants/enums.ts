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

export const REQUEST_STATUS = [
  "new",
  "in_progress",
  "done",
  "canceled",
] as const;

export const PAYMENT_STATUS = ["paid", "unpaid", "partly_paid"] as const;

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

export const INVOICE_STATUS = [
  "pending",
  "paid",
  "cancelled",
  "failed",
] as const;

export const DELIVERY_TYPE = ["door", "warehouse"] as const;

export const ORDER_PERFORMER_TYPE = ["modeller", "miller", "printer"];
export const ORDER_CHAT_MEDIA_TYPE = ["image", "video", "file", "audio"];
