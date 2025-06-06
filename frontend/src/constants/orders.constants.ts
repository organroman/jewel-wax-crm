import { mapToOptions } from "@/lib/utils";
import {
  ORDER_STAGE,
  PAYMENT_STATUS,
  ORDER_STAGE_STATUS,
} from "./enums.constants";

export const ORDER_STAGES = [
  { key: "all", value: "all" },
  ...mapToOptions(ORDER_STAGE),
];

export const STATIC_ORDER_FILTERS = [
  {
    param: "payment_status",
    key: "payment_status",
    options: mapToOptions(PAYMENT_STATUS),
    permission: "super_admin",
  },
];

export const STAGE_STATUS = mapToOptions(ORDER_STAGE_STATUS);

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
  pending: "text-black",
  processed: "text-brand-default",
  in_process: "text-blue",
  negotiation: "text-accent-red",
  clarification: "text-accent-peach",
  done: "text-brand-default",
};
