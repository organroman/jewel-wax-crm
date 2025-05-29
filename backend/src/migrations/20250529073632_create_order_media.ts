import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_media", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.enu("type", ["image", "file", "other"]).notNullable();
    table.string("url").notNullable();
    table.string("mime_type");
    table.string("name");
    table.integer("uploaded_by").unsigned().references("id").inTable("persons");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_media");
}
