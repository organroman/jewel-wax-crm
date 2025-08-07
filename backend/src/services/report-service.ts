import {
  ClientsReportRaw,
  GetAllModellingReportOptions,
  GetAllReportOptions,
  ModellingReportRaw,
  PaginatedClientsReportResult,
  PaginatedModellingReportResult,
} from "../types/report.types";
import { PaymentStatus } from "../types/finance.type";

import { PersonModel } from "../models/person-model";
import { OrderModel } from "../models/order-model";
import { FinanceModel } from "../models/finance-model";
import { ReportModel } from "../models/report-model";

import {
  defineFromToDates,
  definePaymentAmountByPaymentMethod,
  definePaymentStatus,
  getFullName,
  groupBy,
} from "../utils/helpers";

export const ReportService = {
  async getClientsReport({
    page = 1,
    limit = 10,
    filters,
    sortBy = "last_name",
    order = "asc",
  }: GetAllReportOptions): Promise<
    PaginatedClientsReportResult<ClientsReportRaw>
  > {
    const { startFrom, finishTo } = defineFromToDates(
      filters?.from,
      filters?.to
    );

    const personFilters = { role: "client", person_id: filters?.person_id };

    const { total_active, total_new_clients, total_debtors } =
      await ReportModel.getClientsIndicators({
        from: startFrom,
        to: finishTo,
      });

    const persons = await PersonModel.getAll({
      page,
      limit,
      filters: personFilters,
      sortBy,
      order,
    });

    const personIds = persons.data.map((p) => p.id);

    const allPhones = await PersonModel.getPhonesByPersonIds(personIds);
    const allEmails = await PersonModel.getEmailsByPersonIds(personIds);
    const allLocations = await PersonModel.getLocationsByPersonIds(personIds);
    const allOrders = await OrderModel.getOrdersByCustomerIds({
      customerIds: personIds,
      from: startFrom,
      to: finishTo,
    });

    const allOrderIds = allOrders.map((o) => o.id);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(allOrderIds);

    const invoicesByOrder = groupBy(allInvoices, "order_id");

    const ordersByPerson = groupBy(allOrders, "customer_id");

    const enriched = persons.data.map((person) => {
      const orders = ordersByPerson[person.id] || [];
      const ordersAmount = orders.length;
      const ordersInProgress = orders.filter(
        (order) => order.active_stage !== "done"
      ).length;

      const ordersTotalAmount = orders.reduce(
        (sum, order) => sum + Number(order.amount || 0),
        0
      );

      const totalPaid = orders.reduce((sum, order) => {
        const invoices = invoicesByOrder[order.id] || [];
        return (
          sum + invoices.reduce((s, i) => s + Number(i.amount_paid || 0), 0)
        );
      }, 0);

      const debt = ordersTotalAmount - totalPaid;

      const lastOrder = orders.sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      )[0];

      const phonesByPerson = groupBy(allPhones, "person_id");
      const phones = phonesByPerson[person.id] || [];
      const phone = phones.find((p) => p.is_main)?.number ?? phones[0].number;

      const emailsByPerson = groupBy(allEmails, "person_id");
      const emails = emailsByPerson[person.id] || [];
      const email = emails.find((e) => e.is_main)?.email ?? emails[0]?.email;

      const locationsByPerson = groupBy(allLocations, "person_id");
      const locations = locationsByPerson[person.id] || [];
      const city =
        locations.find((l) => l.is_main)?.city_name ?? locations[0]?.city_name;

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
    });

    return {
      ...persons,
      data: enriched,
      total_clients: persons.total,
      active_clients: Number(total_active),
      new_clients: Number(total_new_clients),
      total_debtors,
    };
  },
  async getModellingReport({
    page,
    limit,
    filters,
    user_id,
    user_role,
  }: GetAllModellingReportOptions): Promise<
    PaginatedModellingReportResult<ModellingReportRaw>
  > {
    const { startFrom, finishTo } = defineFromToDates(
      filters?.from,
      filters?.to
    );
    const isAdmin = user_role === "super_admin";

    const { totalModelingCost, totalOrders, sumOfExpenses, debt } =
      await ReportModel.getModelingIndicators({
        from: startFrom,
        to: finishTo,
        user_id,
        isAdmin,
      });
    const orders = await ReportModel.getOrdersWithModeling({
      page,
      limit,
      from: startFrom,
      to: finishTo,
      person_id: filters?.person_id,
      user_id,
      user_role,
    });

    const allOrderIds = orders.data.map((o) => o.id);
    const allStages = await OrderModel.getOrderStagesByOrderIds(allOrderIds);

    const stagesByOrder = groupBy(allStages, "order_id");

    const allExpenses = await FinanceModel.getExpensesByOrderIds(
      allOrderIds,
      "modelling"
    );
    const expensesByOrder = groupBy(allExpenses, "order_id");
    const enriched = orders.data.map((order) => {
      const stages = stagesByOrder[order.id];

      const activeStageStatus =
        stages.find((stage) => stage.stage === order.active_stage)?.status ??
        "pending";

      const modelingStageStatus =
        stages.find((stage) => stage.stage === "modeling")?.status ?? "pending";

      const expenses = expensesByOrder[order.id] || [];

      const totalPaidForModeling = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
      );
      let modellingPaymentStatus: PaymentStatus = "unpaid";
      let debt: number = 0;

      if (order?.modeling_cost) {
        debt = order?.modeling_cost - totalPaidForModeling;
        modellingPaymentStatus = definePaymentStatus(
          totalPaidForModeling,
          order.modeling_cost
        );
      }

      const {
        transactionsAmount: cashAmount,
        transactionsPaymentsAmount: cashPaymentsAmount,
        transactionLastPaymentDate: cashLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(expenses, "cash", {
        amountField: "amount",
        dateField: "created_at",
      });

      const {
        transactionsAmount: bankAmount,
        transactionsPaymentsAmount: bankPaymentsAmount,
        transactionLastPaymentDate: bankLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(expenses, "bank_transfer", {
        amountField: "amount",
        dateField: "created_at",
      });

      const {
        transactionsAmount: cardAmount,
        transactionsPaymentsAmount: cardPaymentsAmount,
        transactionLastPaymentDate: cardLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(expenses, "card_transfer", {
        amountField: "amount",
        dateField: "created_at",
      });

      const lastPaymentComment =
        expenses.length > 0
          ? expenses
              .filter((a) => a.created_at !== null)
              .sort((a, b) => (a.created_at! > b.created_at! ? -1 : 1))[0]
              ?.description
          : null;

      return {
        id: order.id,
        number: order.number,
        modeller: {
          id: order.modeller_id,
          fullname: getFullName(
            order.modeller_first_name,
            order.modeller_last_name,
            order.modeller_patronymic
          ),
        },
        modeling_payment_status: modellingPaymentStatus,
        modelling_cost: order.modeling_cost,
        order_stage: isAdmin ? order.active_stage : "modeling",
        stage_status: isAdmin ? activeStageStatus : modelingStageStatus,
        cash_amount: cashAmount,
        cash_payments_amount: cashPaymentsAmount,
        cash_payment_date: cashLastPaymentDate,
        bank_amount: bankAmount,
        bank_payments_amount: bankPaymentsAmount,
        bank_payment_date: bankLastPaymentDate,
        card_amount: cardAmount,
        card_payments_amount: cardPaymentsAmount,
        card_payment_date: cardLastPaymentDate,
        debt: debt,
        last_payment_comment: lastPaymentComment,
      };
    });

    return {
      ...orders,
      data: enriched,
      total_orders: totalOrders,
      total_modelling_cost: totalModelingCost,
      total_modelling_paid: sumOfExpenses,
      total_modelling_debt: debt,
    };
  },
};
