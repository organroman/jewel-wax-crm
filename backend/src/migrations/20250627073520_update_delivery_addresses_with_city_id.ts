import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {

    table.dropColumn("np_city_ref");
    table
      .integer("city_id")
      .unsigned()
      .references("id")
      .inTable("cities")
      .onDelete("SET NULL")
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {

    table.dropForeign(["city_id"]);
    table.dropColumn("city_id");
    table.string("np_city_ref");
  });
}
