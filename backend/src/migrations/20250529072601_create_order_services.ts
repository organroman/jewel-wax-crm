import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_services", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.enu("type", ["modeling", "milling", "printing"]).notNullable();
    table
      .integer("person_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table.decimal("cost", 10, 2).defaultTo(0.0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_services");
}
