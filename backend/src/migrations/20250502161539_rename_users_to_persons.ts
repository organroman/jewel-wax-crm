import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Rename table first
  await knex.schema.renameTable("users", "persons");

  // Change column type to TEXT temporarily to break dependency
  await knex.schema.alterTable("persons", (table) => {
    table.text("role").alter(); // <- breaks link to user_role enum
  });

  // Drop the old enum
  await knex.raw(`DROP TYPE IF EXISTS user_role`);

  // Create new expanded enum
  await knex.raw(`
    CREATE TYPE person_role AS ENUM (
      'super_admin',
      'admin',
      'modeller',
      'miller',
      'client',
      'lead'
    )
  `);

  // Convert role back to new enum
  await knex.schema.alterTable("persons", (table) => {
    table.specificType("role", "person_role").notNullable().alter();
    table.string("city").nullable();
    table.string("password").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("persons", (table) => {
    table.dropColumn("city");
    table.dropColumn("role");
    table.dropColumn("password");
  });

  await knex.raw(`DROP TYPE IF EXISTS person_role`);
  await knex.raw(`
    CREATE TYPE user_role AS ENUM (
      'super_admin',
      'admin',
      'modeller',
      'miller'
    )
  `);

  await knex.schema.alterTable("persons", (table) => {
    table.specificType("role", "user_role").notNullable();
    table.string("password").notNullable(); // assuming it was not-null before
  });

  await knex.schema.renameTable("persons", "users");
}
