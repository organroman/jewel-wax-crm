import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("stage_new_status");
    table.dropColumn("stage_new_completed_at");

    table.dropColumn("stage_modeling_status");
    table.dropColumn("stage_modeling_completed_at");

    table.dropColumn("stage_milling_status");
    table.dropColumn("stage_milling_completed_at");

    table.dropColumn("stage_printing_status");
    table.dropColumn("stage_printing_completed_at");

    table.dropColumn("stage_done_status");
    table.dropColumn("stage_done_completed_at");
  });

  await knex.schema.createTable("order_stage_statuses", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .enu("stage", null, {
        useNative: true,
        existingType: true,
        enumName: "order_stage",
      })
      .notNullable();
    table
      .enu("status", null, {
        useNative: true,
        existingType: true,
        enumName: "order_stage_status",
      })
      .notNullable();
    table.timestamp("started_at");
    table.timestamp("completed_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
