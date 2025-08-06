import { GetAllOptions, PaginatedResult } from "./shared.types";

export type GetAllReportOptions = GetAllOptions<{
  from: string;
  to: string;
  person_id?: number;
}>;

export interface PaginatedReportResult<T> extends PaginatedResult<T> {
  total_clients: number;
  active_clients: number;
  new_clients: number;
  clients_debt: number;
}

type ClientReportPerson = {
  id: number;
  avatar_url: string | null;
  fullname: string;
  phone: string | null;
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
  last_order_date: Date | null;
}
