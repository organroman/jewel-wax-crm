import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_deliveries", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("delivery_address_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("delivery_addresses");
    table
      .enu("delivery_service", ["nova_poshta", "manual", "pickup"])
      .notNullable()
      .defaultTo("manual");
    table.decimal("cost", 10, 2).defaultTo(0.0);
    table
      .enu("status", ["new", "declared", "shipped", "delivered", "cancelled"])
      .defaultTo("new");
    table.string("declaration_number"); // TTN
    table.date("estimated_delivery_date");
    table.date("actual_delivery_date");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_deliveries");
}
