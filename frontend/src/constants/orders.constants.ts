import { ORDER_STAGE, PAYMENT_STATUS } from "./enums.constants";

export const ORDER_STAGES = ["all", ...ORDER_STAGE];

export const STATIC_ORDER_FILTERS = [
  {
    param: "payment_status",
    key: "payment_status",
    options: PAYMENT_STATUS.map((ps) => ({ key: ps, value: ps })),
    permission: "super_admin",
  },
];

export const PAYMENT_STATUS_COLORS = {
  paid: "text-brand-default",
  unpaid: "text-accent-red",
  partly_paid: "text-accent-peach",
};

export const STAGE_COLORS = {
  new: "text-accent-olive bg-accent-lime",
  modeling: "text-accent-blue bg-accent-lavender",
  milling: "bg-accent-grey text-black",
  printing: "text-accent-peach bg-accent-yellow",
  delivery: "bg-accent-pink text-accent-red",
  done: "bg-accent-lightgreen text-accent-green",
};

export const STAGE_STATUS_COLORS = {
  pending: "text-text-regular",
  processed: "text-brand-default",
  in_process: "text-accent-blue",
  negotiation: "text-accent-red",
  clarification: "text-accent-peach",
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
  { value: "new", key: "new" },
];
