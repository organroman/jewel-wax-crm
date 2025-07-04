import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_deliveries", (table) => {
    table.dropForeign(["delivery_address_id"]);
  });

  await knex.schema.alterTable("order_deliveries", (table) => {
    table.integer("delivery_address_id").nullable().alter();
    table
      .foreign("delivery_address_id")
      .references("id")
      .inTable("delivery_addresses")
      .onDelete("SET NULL");

    table.string("manual_recipient_name").nullable();
    table.string("manual_recipient_phone").nullable();
    table.string("manual_delivery_address").nullable();
    table.boolean("is_third_party").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop FK constraint first
  await knex.schema.alterTable("order_deliveries", (table) => {
    table.dropForeign(["delivery_address_id"]);
  });

  await knex.schema.alterTable("order_deliveries", (table) => {
    table.dropColumn("manual_recipient_name");
    table.dropColumn("manual_recipient_phone");
    table.dropColumn("manual_delivery_address");
    table.dropColumn("is_third_party");
  });

  await knex.schema.alterTable("order_deliveries", (table) => {
    table.dropColumn("delivery_address_id");
  });

  await knex.schema.alterTable("order_deliveries", (table) => {
    table
      .integer("delivery_address_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("delivery_addresses")
      .onDelete("CASCADE");
  });
}
