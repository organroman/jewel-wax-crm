export const PERSON_SORT_FIELDS = [
  "first_name-desc",
  "first_name-asc",
  "last_name-desc",
  "last_name-asc",
  "created_at-desc",
  "created_at-asc",
  "role",
] as const;

export const CONTACT_SORT_FIELDS = [
  "user_name",
  "full_name",
  "created_at",
  "updated_at",
] as const;

export const REQUEST_SORT_FIELDS = [
  "user_name",
  "source",
  "status",
  "full_name",
  "message",
];

export const ORDERS_SORT_FIELDS = ["created_at-desc", "created_at-asc"];
export const FINANCE_SORT_FIELDS = ["created_at-desc", "created_at-asc"];
