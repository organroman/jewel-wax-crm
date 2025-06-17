import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_media", (table) => {
    table.string("public_id").nullable();
    table.boolean("is_main").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_media", (table) => {
    table.dropColumn("public_id");
    table.dropColumn("is_main");
  });
}
