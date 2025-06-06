import type { Knex } from "knex";
import { OrderModel } from "../models/order-model";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex("invoices").del();

  // Insert seed entries
  await knex("invoices").insert([
    {
      order_id: 1,
      amount: 705.73,
      amount_paid: 705.73,
      payment_method: "cash",
      status: "paid",
      paid_at: new Date(),
      integration_data: null,
      invoice_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      order_id: 2,
      amount: 234.62,
      amount_paid: 234.62,
      payment_method: "card_transfer",
      status: "paid",
      paid_at: new Date(),
      integration_data: null,
      invoice_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      order_id: 3,
      amount: 500,
      amount_paid: 0,
      payment_method: "payment_system",
      status: "pending",
      integration_data: {
        integration_data: "WFP_20250601_0002",
        link: "https://wayforpay.com/pay/wfp_abc123",
      },
      invoice_url: "https://secure.wayforpay.com/payment/invoice2",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      order_id: 4,
      amount: 300,
      amount_paid: 300,
      payment_method: "payment_system",
      status: "paid",
      paid_at: new Date(),
      integration_data: {
        integration_data: "WFP_20250601_0002",
        link: "https://wayforpay.com/pay/wfp_abc123",
      },
      invoice_url: "https://secure.wayforpay.com/payment/invoice3",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      order_id: 4,
      amount: 611.36,
      amount_paid: 0,
      payment_method: "payment_system",
      status: "pending",
      integration_data: {
        integration_data: "WFP_20250601_0002",
        link: "https://wayforpay.com/pay/wfp_abc123",
      },
      invoice_url: "https://secure.wayforpay.com/payment/invoice3",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  await OrderModel.syncAllOrderPaymentStatuses();
}
