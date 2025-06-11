import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "@/constants/enums.constants";
import { PaginatedResult } from "./shared.types";
import { DeliveryAddress } from "./person.types";

export interface OrderPerson {
  id: number;
  fullname: string;
}

export interface OrderCustomerDelivery {
  delivery_address_id: number;
  address_line: string;
  declaration_number: number;
}

export interface OrderCustomer extends OrderPerson {
  delivery_addresses: OrderCustomerDelivery[];
}

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
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDelivery {
  id: number;
  cost: number;
  delivery_address_id: number;
  address_line: string;
  order_id: number;
  declaration_number: number;
}
export interface Order {
  id: number;
  created_at: Date;
  number: number;
  description: string;
  name: string;
  customer: OrderCustomer;
  modeller: OrderPerson | null;
  miller: OrderPerson | null;
  printer: OrderPerson | null;
  media: OrderMedia | null;
  amount: number;
  modeling_cost: number;
  milling_cost: number;
  printing_cost: number;

  payment_status?: PaymentStatus;
  active_stage: Stage;
  active_stage_status?: StageStatus;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  notes: string;
  stages: OrderStage[];
  createdBy: string;
  delivery: OrderDelivery;
}

export interface PaginatedOrdersResult<T> extends PaginatedResult<T> {
  stage_counts: Record<string, number>;
}
