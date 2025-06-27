import {
  ORDER_STAGE,
  ORDER_STAGE_STATUS,
  PAYMENT_STATUS,
} from "../constants/enums";
import { DeliveryType, PersonRole, Phone } from "./person.types";
import { GetAllOptions, PaginatedResult } from "./shared.types";

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export type Stage = (typeof ORDER_STAGE)[number];

export type StageStatus = (typeof ORDER_STAGE_STATUS)[number];

export interface OrderPerson {
  id: number;
  fullname: string;
}

export type CustomerDeliveryAddress = {
  delivery_address_id: number;
  address_line: string;
};

export interface OrderCustomer {
  first_name: string;
  last_name: string;
  patronymic?: string;
  phones: Phone[];
  delivery_addresses: CustomerDeliveryAddress[];
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
  public_id: string;
  is_main?: boolean;
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

export interface OrderDelivery {
  id: number;
  order_id: number;
  delivery_address_id: number;
  delivery_service: string;
  cost: number | string;
  status: string;
  declaration_number: string | null;
  type: DeliveryType;
  city_name: string | null;
  city_ref: string | null;
  area: string | null;
  region: string | null;
  np_warehouse_ref: string | null;
  np_warehouse: string | null;
  np_warehouse_siteKey: string | null;
  np_recipient_ref: string | null;
  np_contact_recipient_ref: string | null;
  street: string | null;
  street_ref: string | null;
  house_number: string | null;
  flat_number: string | null;
  updated_at?: Date;
  estimated_delivery_date: Date;
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
  modeller_id: number | null;
  miller_id: number | null;
  printer_id: number | null;
  milling_cost?: number;
  modeling_cost?: number;
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
  created_by: number;
}

export interface UserOrder {
  id: number;
  created_at: Date;
  updated_at: Date;
  number: number;
  name: string;
  modeller?: OrderPerson | null;
  miller?: OrderPerson | null;
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
  modeller: OrderPerson | null;
  miller: OrderPerson | null;
  printer: OrderPerson | null;
  media: OrderMedia[];
  amount: number;
  payment_status?: PaymentStatus;
  active_stage: Stage;
  active_stage_status: StageStatus | null;
  is_favorite: boolean;
  is_important: boolean;
  processing_days: number;
  stages: OrderStage[];
  delivery?: OrderDelivery | null;
  createdBy: string;
  milling_cost?: number;
  modeling_cost?: number;
  printing_cost?: number;
}

export interface LinkedOrder {
  id?: number;
  order_id: number;
  linked_order_id: number;
  is_common_delivery: number;
  comment: string;
}

export interface CreateOrderInput {
  customer: OrderPerson;
  name: string;
  description?: string;
  notes?: string;
  created_by: number;
  amount: number;
  active_stage: Stage;
  processing_days?: number;
  modeller?: OrderPerson;
  modeling_cost?: number;
  miller?: OrderPerson;
  milling_cost?: number;
  printer?: OrderPerson;
  printing_cost?: number;
  stages: OrderStage[];
  delivery: OrderDelivery;
  linked_orders: LinkedOrder[];
  media: OrderMedia[];
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  created_at: Date;
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
