import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("delivery_addresses", (table) => {
    table.increments("id").primary();
    table
      .integer("person_id")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.string("address_line").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("delivery_addresses");
}
