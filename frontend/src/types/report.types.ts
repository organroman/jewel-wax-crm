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

export interface PaginatedReportResult<T> extends PaginatedResult<T> {
  total_clients: number;
  active_clients: number;
  new_clients: number;
  clients_debt: number;
}
