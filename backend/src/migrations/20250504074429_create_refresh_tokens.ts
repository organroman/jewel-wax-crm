import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("refresh_tokens", (table) => {
    table.increments("id").primary();
    table
      .integer("person_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.string("token").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.boolean("is_valid").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("refresh_tokens");
}
