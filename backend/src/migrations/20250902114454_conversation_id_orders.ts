import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("request_id");
    table
      .integer("conversation_id")
      .references("id")
      .inTable("conversations")
      .onDelete("SET NULL");
  });
  await knex.schema.dropTableIfExists("requests");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("conversation_id");
    table
      .integer("request_id")
      .unsigned()
      .references("id")
      .inTable("requests")
      .onDelete("SET NULL");
  });
  await knex.schema.createTable("requests", (table) => {
    table.increments("id").primary();
    table.text("message").notNullable();
    table.enu(
      "source",
      [
        "telegram",
        "viber",
        "facebook",
        "instagram",
        "whatsapp",
        "form",
        "manual",
      ],
      {
        useNative: true,
        enumName: "request_source",
      }
    );
    table
      .enu("status", ["new", "in_progress", "done", "canceled"], {
        useNative: true,
        enumName: "request_status",
      })
      .notNullable()
      .defaultTo("new");
    table
      .integer("contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}
