import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.string("np_recipient_ref").nullable();
    table.string("np_contact_recipient_ref").nullable();
    table.string("recipient_type").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.dropColumn("np_recipient_ref");
    table.dropColumn("recipient_type");
    table.dropColumn("np_contact_recipient_ref");
  });
}
