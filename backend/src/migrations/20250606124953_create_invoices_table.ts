import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("invoices", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    table
      .integer("issued_by_id")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");

    table.decimal("amount", 10, 2).notNullable();
    table.string("currency", 3).defaultTo("UAH");
    table.decimal("amount_paid", 10, 2).defaultTo(0);

    table
      .enu("payment_method", ["cash", "card_transfer", "payment_system"], {
        useNative: true,
        enumName: "payment_method",
      })
      .notNullable();

    table
      .enu("status", ["pending", "paid", "cancelled", "failed"], {
        useNative: true,
        enumName: "invoice_status",
      })
      .defaultTo("pending");

    table.timestamp("paid_at").nullable();

    // Useful for storing WayforPay metadata: tokens, reference numbers, etc.
    table.jsonb("integration_data").nullable();

    // Optional link to hosted invoice or WayforPay payment page
    table.string("invoice_url").nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("invoices");
  await knex.raw(`DROP TYPE IF EXISTS invoice_status`);
  await knex.raw(`DROP TYPE IF EXISTS payment_method`);
}
