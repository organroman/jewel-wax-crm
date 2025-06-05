import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "@/constants/enums.constants";
import { PaginatedResult } from "./shared.types";

export type OrderCustomer = {
  id: number;
  fullname: string;
};

export interface OrderMedia {
  id: number;
  order_id: number;
  type: string;
  url: string;
  mime_type?: string;
  name?: string;
  uploaded_by: number;
  created_at: Date;
  updated_at: Date;
}

export type Stage = (typeof ORDER_STAGE)[number];

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export type StageStatus = (typeof ORDER_STAGE_STATUS)[number];

export interface Order {
  id: number;
  created_at: Date;
  number: number;
  name: string;
  customer: OrderCustomer;
  media: OrderMedia[];
  amount: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  stage_status?: StageStatus;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  notes: string;
}

export interface PaginatedOrdersResult<T> extends PaginatedResult<T> {
  stage_counts: Record<string, number>;
}
