import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("person_messengers", (table) => {
    table.string("username");
  });

  await knex.raw(`
    ALTER TABLE person_messengers
    ADD CONSTRAINT person_messengers_phone_or_username_chk
    CHECK (phone_id IS NOT NULL OR username IS NOT NULL)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("person_messengers", (table) => {
    table.dropColumn("username");
  });

  await knex.raw(`
    ALTER TABLE person_messengers
    DROP CONSTRAINT IF EXISTS person_messengers_phone_or_username_chk
  `);
}
