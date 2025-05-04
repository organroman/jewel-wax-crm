import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("activity_logs", (table) => {
    table.increments("id").primary();
    table
      .integer("actor_id")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    table.string("action").notNullable();
    table.string("target_type").notNullable();
    table.integer("target_id").unsigned().notNullable();
    table.jsonb("details");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("activity_logs");
}
