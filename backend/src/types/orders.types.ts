import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "../constants/enums";
import { PersonRole } from "./person.types";
import { GetAllOptions, PaginatedResult } from "./shared.types";

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export type Stage = (typeof ORDER_STAGE)[number];

export type StageStatus = (typeof ORDER_STAGE_STATUS)[number];

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
export interface OrderFavorite {
  id: number;
  order_id: number;
  person_id: number;
  created_at: Date;
  updated_at: Date;
}

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

type ShortPerson = {
  id: number;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
};

export interface OrderBase {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  customer_id: number;
  amount: number;
  active_stage: Stage;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number | null;
  modeller_id: number;
  miller_id: number;
  printer_id: number;
  milling_cost?: number;
  modelling_cost?: number;
  active_stage_status?: StageStatus | null;
  media: OrderMedia | null;
  modeller_first_name?: string;
  modeller_last_name?: string;
  modeller_patronymic?: string;
  miller_first_name?: string;
  miller_last_name?: string;
  miller_patronymic?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_patronymic?: string;
  printer_first_name?: string;
  printer_last_name?: string;
  printer_patronymic?: string;
}

export interface UserOrder {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  modeller?: OrderCustomer | null;
  miller?: OrderCustomer | null;
  media: OrderMedia | null;
  modelling_cost?: number;
  milling_cost?: number;
  is_favorite: boolean;
  is_important: boolean;
  stages: OrderStage[];
}
export interface AdminOrder {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  customer: OrderCustomer | null;
  modeller: OrderCustomer | null;
  miller: OrderCustomer | null;
  printer: OrderCustomer | null;
  media: OrderMedia | null;
  amount: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  active_stage_status: StageStatus | null;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  stages: OrderStage[];
}

export interface Order {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  customer: OrderCustomer | null;
  modeller: OrderCustomer | null;
  miller: OrderCustomer | null;
  printer: OrderCustomer | null;
  media: OrderMedia[];
  amount: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  active_stage_status: StageStatus | null;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  stages: OrderStage[];
}

export interface GetAllOrdersOptions
  extends GetAllOptions<{
    active_stage?: Stage;
    payment_status?: PaymentStatus[];
  }> {
  user_id: number;
  user_role: PersonRole;
}

export interface PaginatedOrdersResult<T> extends PaginatedResult<T> {
  stage_counts: Record<string, number>;
}
