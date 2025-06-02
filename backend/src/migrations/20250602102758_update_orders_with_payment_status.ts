import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.enu("payment_status", ["paid", "unpaid", "partly_paid"], {
      useNative: true,
      enumName: "payment_status",
    });
  });
}

export async function down(knex: Knex): Promise<void> {}
