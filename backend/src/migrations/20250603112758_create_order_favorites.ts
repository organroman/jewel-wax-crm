import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("is_favorite");
  });

  // Create order_favorites table
  await knex.schema.createTable("order_favorites", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("person_id")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.timestamps(true, true);

    table.unique(["order_id", "person_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_favorites");

  await knex.schema.alterTable("orders", (table) => {
    table.boolean("is_favorite").defaultTo(false);
  });
}
