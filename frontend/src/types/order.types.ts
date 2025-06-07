import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "@/constants/enums.constants";
import { PaginatedResult } from "./shared.types";

export type OrderPerson = {
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

export interface OrderStage {
  id: number;
  order_id: number;
  stage: Stage;
  status: StageStatus;
  started_at: Date;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
}
export interface Order {
  id: number;
  created_at: Date;
  number: number;
  description: string;
  name: string;
  customer: OrderPerson;
  modeller: OrderPerson | null;
  miller: OrderPerson | null;
  printer: OrderPerson | null;
  media: OrderMedia | null;
  amount: number;
  modeling_cost: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  active_stage_status?: StageStatus;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  notes: string;
  stages: OrderStage[];
}

export interface PaginatedOrdersResult<T> extends PaginatedResult<T> {
  stage_counts: Record<string, number>;
}
