import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.string("np_warehouse").nullable();
    table.string("np_warehouse_siteKey").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.dropColumn("np_warehouse");
    table.dropColumn("np_warehouse_siteKey");
  });
}
