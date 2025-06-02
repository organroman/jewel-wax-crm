import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  await knex.schema.dropTableIfExists("order_stage_statuses");
  await knex.raw(`DROP TYPE IF EXISTS "order_stage"`);
  await knex.raw(`DROP TYPE IF EXISTS "order_stage_status"`);
  await  knex.schema.createTable("order_stage_statuses", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .enu(
        "stage",
        ["new", "modeling", "milling", "printing", "delivery", "done"],
        {
          useNative: true,
          enumName: "order_stage",
        }
      )
      .notNullable();
    table
      .enu(
        "status",
        [
          "pending",
          "processed",
          "in_process",
          "negotiation",
          "clarification",
          "done",
        ],
        {
          useNative: true,
          enumName: "order_stage_status",
        }
      )
      .notNullable();
    table.timestamp("started_at");
    table.timestamp("completed_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_stage_statuses");
}
