import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.dropColumn("settlementType_ref");
    table.dropColumn("settlementType");

    table.string("settlement_type_ref");
    table.string("settlement_type");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.dropColumn("settlement_type_ref");
    table.dropColumn("settlement_type");

    table.string("settlementType_ref");
    table.string("settlementType");
  });
}
