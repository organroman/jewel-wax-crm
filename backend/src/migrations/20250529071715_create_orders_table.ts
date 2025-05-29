import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id").primary();
    table
      .integer("request_id")
      .unsigned()
      .references("id")
      .inTable("requests")
      .onDelete("SET NULL");
    table
      .integer("customer_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table.string("number", 10).notNullable().unique(); // 0001, 0002...
    table.string("name").notNullable();
    table.text("description");
    table.text("notes");
    table
      .integer("created_by")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table.decimal("amount", 10, 2).defaultTo(0.0);
    table
      .enu("active_stage", [
        "new",
        "modeling",
        "milling",
        "printing",
        "delivery",
        "done",
      ])
      .defaultTo("new");
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("orders");
}
