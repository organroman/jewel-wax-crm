import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("order_favorites").del();

  await knex("order_favorites").insert([
    {
      person_id: 10,
      order_id: 10,
      created_at: "2025-06-03T12:14:34.881124",
      updated_at: "2025-06-03T12:14:34.881124",
    },
    {
      person_id: 10,
      order_id: 1,
      created_at: "2025-06-03T12:14:34.881124",
      updated_at: "2025-06-03T12:14:34.881124",
    },
    {
      person_id: 10,
      order_id: 7,
      created_at: "2025-06-03T12:14:34.881124",
      updated_at: "2025-06-03T12:14:34.881124",
    },
    {
      person_id: 10,
      order_id: 4,
      created_at: "2025-06-03T12:14:34.881124",
      updated_at: "2025-06-03T12:14:34.881124",
    },
  ]);
}
