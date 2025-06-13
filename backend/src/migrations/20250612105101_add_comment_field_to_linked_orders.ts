import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_links", (table) => {
    table.string("comment").nullable();
    table.boolean("is_common_delivery").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_links", (table) => {
    table.dropColumn("comment");
    table.dropColumn("is_common_delivery");
  });
}
