import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("chat_media", (table) => {
    table.string("public_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("chat_media", (table) => {
    table.dropColumn("public_id");
  });
}
