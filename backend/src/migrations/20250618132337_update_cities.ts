import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.string("ref").unique().nullable();
    table.string("area_ref").unique().nullable();
    table.string("area").nullable();
    table.string("settlementType_ref").nullable();
    table.string("settlementType").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.dropColumn("ref");
    table.dropColumn("area_ref");
    table.dropColumn("area");
    table.dropColumn("settlementType_ref");
    table.dropColumn("settlementType");
  });
}
