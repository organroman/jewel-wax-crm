import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table
      .enu("type", ["warehouse", "door"], {
        useNative: true,
        enumName: "delivery_type",
      })
      .defaultTo("warehouse");
    table
      .string("np_city_ref")
      .nullable()
      .references("ref")
      .inTable("cities");
    table.string("np_warehouse_ref").nullable();
    table.string("street").nullable();
    table.string("street_ref").nullable();
    table.string("house_number").nullable();
    table.string("flat_number").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.dropColumn("type");
    table.dropColumn("np_city_ref");
    table.dropColumn("np_warehouse_ref");
    table.dropColumn("street");
    table.dropColumn("street_ref");
    table.dropColumn("house_number");
    table.dropColumn("flat_number");
  });
}
