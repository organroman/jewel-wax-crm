import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("password_reset_tokens", (table) => {
    table.increments("id").primary();
    table
      .integer("person_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.string("token").notNullable().unique();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.boolean("is_used").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("password_reset_tokens");
}
