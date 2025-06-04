import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "../constants/enums";
import { PersonRole } from "./person.types";
import { GetAllOptions } from "./shared.types";

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
}

export interface Order {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  customer: OrderCustomer;
  media: OrderMedia[];
  amount: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  stage_status: StageStatus | null;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
}

export interface GetAllOrdersOptions
  extends GetAllOptions<{
    is_important?: boolean;
  }> {
  user_id: number;
  user_role: PersonRole;
}
