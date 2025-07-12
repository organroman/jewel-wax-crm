

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Create the sequence for order numbers
  await knex.raw(`
    CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
  `);

  // 2. Create trigger function to auto-fill number
  await knex.raw(`
    CREATE OR REPLACE FUNCTION generate_order_number()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.number IS NULL THEN
        NEW.number := LPAD(NEXTVAL('order_number_seq')::text, 4, '0');
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 3. Drop existing UNIQUE constraint (if any), to re-add after trigger
  await knex.schema.alterTable("orders", (table) => {
    table.dropUnique(["number"]);
  });

  // 4. Attach trigger to auto-generate number before insert
  await knex.raw(`
    CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();
  `);

  // 5. Re-add unique constraint on number
  await knex.schema.alterTable("orders", (table) => {
    table.unique(["number"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  // 1. Drop the trigger
  await knex.raw(`DROP TRIGGER IF EXISTS set_order_number ON orders;`);

  // 2. Drop the trigger function
  await knex.raw(`DROP FUNCTION IF EXISTS generate_order_number;`);

  // 3. Drop the sequence
  await knex.raw(`DROP SEQUENCE IF EXISTS order_number_seq;`);
}
