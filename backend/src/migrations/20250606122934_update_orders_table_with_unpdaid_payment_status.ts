import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE orders ALTER COLUMN payment_status SET DEFAULT 'unpaid'`
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE orders ALTER COLUMN payment_status DROP DEFAULT`);
}
