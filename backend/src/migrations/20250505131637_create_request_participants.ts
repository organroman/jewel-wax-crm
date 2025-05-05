import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("request_participants", (table) => {
    table.increments("id").primary();
    table
      .integer("request_id")
      .notNullable()
      .references("id")
      .inTable("requests")
      .onDelete("CASCADE");
    table
      .integer("contact_id")
      .notNullable()
      .references("id")
      .inTable("contacts")
      .onDelete("CASCADE");
    table.timestamp("added_at").defaultTo(knex.fn.now());

    table.unique(["request_id", "contact_id"]); // prevent duplicates
  });
}

export async function down(knex: Knex): Promise<void> {
     await knex.schema.dropTableIfExists("request_participants");
}
