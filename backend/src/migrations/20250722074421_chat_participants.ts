import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("chat_participants", (table) => {
    table.increments("id").primary();
    table
      .integer("chat_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("order_chats")
      .onDelete("CASCADE");
    table
      .integer("person_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");

    table.timestamp("joined_at").defaultTo(knex.fn.now());

    table.unique(["chat_id", "person_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("chat_participants");
}
