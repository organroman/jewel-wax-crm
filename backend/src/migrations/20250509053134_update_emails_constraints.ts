import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("person_emails", (table) => {
    table.unique(["email"]);
  });

  await knex.raw(`
    CREATE UNIQUE INDEX one_main_email_per_person
    ON person_emails(person_id)
    WHERE is_main = true
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("person_emails", (table) => {
    table.dropUnique(["person_emails"]);
  });

  await knex.raw(`DROP INDEX IF EXISTS one_main_email_per_person`);
}
