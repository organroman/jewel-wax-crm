import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "./enums.constants";

export const ORDER_STAGES = ["all", ...ORDER_STAGE];

export const STATIC_ORDER_FILTERS = [
  {
    param: "payment_status",
    key: "payment_status",
    options: PAYMENT_STATUS.map((ps) => ({ key: ps, value: ps })),
    permission: ["super_admin"],
  },
  {
    param: "is_important",
    key: "is_important",
    options: [
      { key: "important", value: true },
      { key: "not_important", value: false },
    ],
    permission: "super_admin",
  },
  {
    param: "is_favorite",
    key: "is_favorite",
    options: [
      { key: "favorite", value: true },
      { key: "not_favorite", value: false },
    ],
    permission: "super_admin",
  },
  {
    param: "active_stage_status",
    key: "active_stage_status",
    options: ORDER_STAGE_STATUS.map((s) => ({ key: s, value: s })),
    permission: "super_admin",
  },
];

export const PAYMENT_STATUS_COLORS = {
  paid: "text-brand-default",
  unpaid: "text-accent-red",
  // partly_paid: "text-accent-peach",
  partly_paid: "text-action-plus",
};

export const STAGE_COLORS = {
  // new: "text-accent-olive bg-accent-lime",
  new: "text-accent-orange bg-accent-beige",
  modeling: "text-accent-blue bg-accent-lavender",
  milling: "bg-accent-grey text-black",
  // printing: "text-accent-peach bg-accent-yellow",
  printing: "text-accent-violet bg-accent-purple",
  delivery: "bg-accent-pink text-accent-red",
  done: "bg-accent-lightgreen text-accent-green",
};

export const STAGE_STATUS_COLORS = {
  pending: "text-text-regular",
  processed: "text-brand-default",
  in_process: "text-accent-blue",
  negotiation: "text-accent-red",
  // clarification: "text-accent-peach",
  clarification: "text-action-plus",
  done: "text-brand-default",
};

export const ORDER_CARD_TABS_LIST = [
  {
    value: "order",
    key: "order",
  },
  {
    key: "payments",
    value: "payments",
  },
  {
    key: "chat",
    value: "chat",
  },
  {
    key: "changes_history",
    value: "changes_history",
  },
  { value: "new", key: "new" },
];
