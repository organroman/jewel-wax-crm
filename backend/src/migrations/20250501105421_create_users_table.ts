import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'modeller', 'miller');
  `);

  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("full_name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable(); //Hashed
    table.specificType("role", "user_role").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");

  await knex.raw(`DROP TYPE IF EXISTS user_role`);
}
