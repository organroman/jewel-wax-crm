import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_stage_statuses", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.enu("stage", ["modeling", "milling", "printing"]).notNullable();
    table.enu("status", ["not_started", "in_process", "done"]).notNullable();
    table.timestamp("started_at");
    table.timestamp("completed_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_stage_statuses");
}
