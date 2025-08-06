import { Person } from "../types/person.types";
import {
  ClientsReportRaw,
  GetAllReportOptions,
  PaginatedReportResult,
} from "../types/report.types";
import { OrderBase } from "../types/order.types";

import db from "../db/db";

import { PersonModel } from "../models/person-model";
import { OrderModel } from "../models/order-model";
import { FinanceModel } from "../models/finance-model";

import { getFullName } from "../utils/helpers";

export const ReportService = {
  async getClientsReport({
    page = 1,
    limit = 10,
    filters,
    sortBy = "last_name",
    order = "asc",
  }: GetAllReportOptions): Promise<PaginatedReportResult<ClientsReportRaw>> {
    const basePersonsQuery = db<Person>("persons").select("id");

    const today = new Date();

    const startOfMonth = today;
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startFrom = filters?.from ? new Date(filters.from) : startOfMonth;

    const finishTo = filters?.to ? new Date(filters?.to) : today;

    startFrom.setHours(0, 0, 0, 0);
    finishTo.setHours(23, 59, 59, 999);

    const [{ total_active }] = await db
      .from(
        basePersonsQuery
          .where((qb) => {
            qb.where("role", "client").andWhere("is_active", true);
          })
          .clone()
          .as("t")
      )
      .count({ total_active: "*" });

    const personFilters = { role: "client", person_id: filters?.person_id };

    const [{ total_new_clients }] = await db
      .from(
        basePersonsQuery
          .where((qb) => {
            qb.whereBetween("created_at", [startFrom, finishTo]);
          })
          .clone()
          .as("t")
      )
      .count({ total_new_clients: "*" });

    const totalDebtArr = await db<OrderBase>("orders")
      .whereIn("payment_status", ["unpaid", "partly_paid"])
      .andWhereBetween("created_at", [startFrom, finishTo])
      .groupBy("customer_id")
      .count("* as total");


    const persons = await PersonModel.getAll({
      page,
      limit,
      filters: personFilters,
      sortBy,
      order,
    });

    const enriched = await Promise.all(
      persons.data.map(async (person) => {
        const orders = await OrderModel.getOrdersByCustomerId({
          customerId: person.id,
          from: startFrom,
          to: finishTo,
        });

        const phones = await PersonModel.getPhonesByPersonId(person.id);
        const phone = phones.find((p) => p.is_main)?.number ?? phones[0].number;

        const emails = await PersonModel.getEmailsByPersonId(person.id);
        const email = emails.find((e) => e.is_main)?.email ?? emails[0]?.email;

        const locations = await PersonModel.getLocationsByPersonId(person.id);
        const city =
          locations.find((l) => l.is_main)?.city_name ??
          locations[0]?.city_name;

        const ordersAmount = orders.length;

        const ordersInProgress = orders.filter(
          (order) => order.active_stage !== "done"
        ).length;

        const ordersTotalAmount = orders.reduce(
          (sum, order) => sum + Number(order.amount || 0),
          0
        );

        let totalPaid: number = 0;

        await Promise.all(
          orders.map(async (order) => {
            const invoices = await FinanceModel.getInvoicesByOrder(order.id);
            totalPaid = invoices.reduce(
              (sum, invoice) => sum + Number(invoice.amount_paid || 0),
              0
            );
          })
        );

        const debt = ordersTotalAmount - totalPaid;

        const lastOrder = await OrderModel.getLastCustomerOrder(person.id);

        return {
          client: {
            id: person.id,
            avatar_url: person.avatar_url ?? null,
            fullname: getFullName(
              person.first_name,
              person.last_name,
              person.patronymic
            ),
            phone,
            email: email ?? null,
            created_at: person.created_at,
            city: city ?? null,
          },
          orders_amount: ordersAmount,
          orders_in_progress: ordersInProgress,
          total_amount_paid: totalPaid,
          total_debt: debt,
          last_order_date: lastOrder?.created_at ?? null,
        };
      })
    );
    return {
      ...persons,
      data: enriched,
      total_clients: persons.total,
      active_clients: Number(total_active),
      new_clients: Number(total_new_clients),
      clients_debt: totalDebtArr.length,
    };
  },
};
