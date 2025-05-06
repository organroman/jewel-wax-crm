import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("requests", (table) => {
    table.dropColumn("person_id");
    table.dropColumn("is_qualified");
    table
      .enu("status", ["new", "in_progress", "done", "canceled"], {
        useNative: true,
        enumName: "request_status",
      })
      .defaultTo("new");
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("requests", (table) => {
    table.dropColumn("status");
  });

  await knex.raw(`DROP TYPE IF EXISTS request_status`);
}
