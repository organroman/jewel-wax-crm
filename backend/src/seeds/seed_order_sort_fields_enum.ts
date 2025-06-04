import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("enums").insert([
    {
      type: "order_sort_fields",
      value: "created_at",
      label: "Створено",
      sort_order: 1,
    },
    {
      type: "order_sort_fields",
      value: "is_favorite",
      label: "Обране",
      sort_order: 2,
    },
    {
      type: "order_sort_fields",
      value: "is_important",
      label: "Важливе",
      sort_order: 3,
    },
  ]);
}
