import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("enums").del();

  await knex("enums").insert([
    {
      type: "person_role",
      value: "super_admin",
      label: "Супер Адмін",
      sort_order: 1,
    },
    {
      type: "person_role",
      value: "modeller",
      label: "Модельєр",
      sort_order: 2,
    },
    {
      type: "person_role",
      value: "miller",
      label: "Фрезерувальник",
      sort_order: 3,
    },
    { type: "person_role", value: "client", label: "Клієнт", sort_order: 4 },
    { type: "person_role", value: "print", label: "Друк", sort_order: 5 },
    
    { type: "person_sort_fields", value: "first_name", label: "Ім'я", sort_order: 1 },
    { type: "person_sort_fields", value: "last_name", label: "Прізвище", sort_order: 2 },
    { type: "person_sort_fields", value: "created_at", label: "Створено", sort_order: 3 },
    { type: "person_sort_fields", value: "role", label: "Роль", sort_order: 4 },


  ]);
}

export async function down(knex: Knex): Promise<void> {}
