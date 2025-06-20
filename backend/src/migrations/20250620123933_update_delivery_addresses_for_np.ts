import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("delivery_addresses", (table) => {
      table.string("address_line").nullable().alter(); 
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.string("address_line").notNullable().alter();
  });
}
