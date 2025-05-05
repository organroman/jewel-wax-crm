import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
  
    await trx("persons").where("role", "admin").update({ role: "super_admin" });

    await trx.raw(`
      ALTER TYPE person_role RENAME TO person_role_old;
    `);

    await trx.raw(`
      CREATE TYPE person_role AS ENUM (
        'super_admin',
        'modeller',
        'miller',
        'client',
        'print'
      );
    `);

    await trx.raw(`
      ALTER TABLE persons
      ALTER COLUMN role TYPE person_role
      USING role::text::person_role;
    `);

    await trx.raw(`DROP TYPE person_role_old;`);
  });
}

export async function down(knex: Knex): Promise<void> {
}
