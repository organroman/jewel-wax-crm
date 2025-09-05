import { ExpenseCategory, PaymentMethod, PaymentStatus } from "./finance.types";
import { OrderPerson, Stage, StageStatus } from "./order.types";
import { PersonRoleValue } from "./person.types";
import { PaginatedResult } from "./shared.types";

type ClientReportPerson = {
  id: number;
  avatar_url: string | null;
  fullname: string;
  phone: string;
  email: string;
  city: string | null;
  created_at: Date;
};
export interface ClientsReportRaw {
  client: ClientReportPerson;
  orders_amount: number | null;
  orders_in_progress: number | null;
  total_amount_paid: number;
  total_debt: number;
  last_order_date: Date;
}

export interface PaginatedClientsReportResult<T> extends PaginatedResult<T> {
  total_clients: number;
  active_clients: number;
  new_clients: number;
  total_debtors: number;
}
export interface ModelingReportOrder {
  id: number;
  number: number;
  active_stage: Stage;
  created_at: Date;
  modeller_id: number;
  modeller_first_name: string;
  modeller_last_name: string;
  modeller_patronymic: string;
  modeling_cost: number;
}
export interface ModellingReportRaw {
  id: number;
  number: number;
  modeller: OrderPerson;
  modeling_payment_status: PaymentStatus;
  modelling_cost: number;
  order_stage: Stage;
  stage_status: StageStatus;
  cash_amount: number | null;
  cash_payments_amount: number | null;
  cash_payment_date: Date | null;
  bank_amount: number | null;
  bank_payments_amount: number | null;
  bank_payment_date: Date | null;
  card_amount: number | null;
  card_payments_amount: number | null;
  card_payment_date: Date | null;
  debt: number;
  last_payment_comment: string | null;
}

export type StagesDays = {
  new: number;
  modeling: number;
  milling: number;
  printing: number;
  delivery: number;
  processing_days: number;
};

export interface OrderReportRaw {
  id: number;
  number: number;
  created_at: Date;
  name: string;
  completed_at: Date;
  media: string | null;
  customer: OrderPerson;
  active_stage: Stage;
  active_stage_status: StageStatus;
  stagesDays: StagesDays;
  processing_days: number;
}

export interface PaginatedModellingReportResult<T> extends PaginatedResult<T> {
  total_orders: number | null;
  total_modelling_cost: number | null;
  total_modelling_paid: number;
  total_modelling_debt: number;
}

export interface PaginatedOrdersReportResult<T> extends PaginatedResult<T> {
  total_orders: number;
  total_done: number;
  total_problem: number;
  total_in_process: number;
}
export interface PaginatedExpensesReportResult<T> extends PaginatedResult<T> {
  total_expenses_amount: number | null;
  total_modelling_exp_amount: number | null;
  total_printing_exp_amount: number;
  total_materials_exp_amount: number;
  total_other_exp_amount: number;
}

type ExpenseOrder = {
  id: number;
  number: number;
};

interface ExpensePerson extends OrderPerson {
  role: PersonRoleValue;
}
export interface ExpensesReportRaw {
  id: number;
  created_at: Date;
  order: ExpenseOrder | null;
  person: ExpensePerson | null;
  amount: number;
  payment_method: PaymentMethod;
  category: ExpenseCategory;
  description: string | null;
}

export interface FinanceReportOrder {
  id: number;
  number: number;
  created_at: Date;
  amount: number;
  modeling_cost: number;
  printing_cost: number;
  customer_id: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_patronymic: string;
}

export interface FinanceReportRaw {
  id: number;
  number: number;
  created_at: Date;
  customer: OrderPerson;
  amount: number;
  paid: number;
  debt: number;
  actual_expenses: number;
  actual_profit: number;
  actual_profitability: number;
  planed_expenses: number;
  planed_profit: number;
  planed_profitability: number;
}

export interface PaginatedFinanceReportResult<T> extends PaginatedResult<T> {
  total_actual_income: number;
  total_debt: number;
  total_expenses: number;
  total_profit: number;
  total_profitability: number;
}
