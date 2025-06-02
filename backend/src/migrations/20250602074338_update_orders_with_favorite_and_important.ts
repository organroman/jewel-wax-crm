import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.boolean("is_favorite").notNullable().defaultTo(false);
    table.boolean("is_important").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.dropColumn("is_main");
  });
}
