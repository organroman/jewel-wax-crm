import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_stage_statuses", (table) => {
    table
      .enu("status", null, {
        useNative: true,
        existingType: true,
        enumName: "order_stage_status",
      })
      .nullable()
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_stage_statuses", (table) => {
    table
      .enu("status", null, {
        useNative: true,
        existingType: true,
        enumName: "order_stage_status",
      })
      .notNullable()
      .alter();
  });
}
