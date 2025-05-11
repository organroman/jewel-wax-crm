export const PERSON_FILTERS = [{ label: "Активний", value: "is_active" }];
export const PERSON_ROLE_ALL = {
  label: "Всі контрагенти",
  value: "all",
  type: "person_role",
};

export const PERSON_ROLES = {
  super_admin: { label: "Супер адмін", color: "bg-gray-100 text-black" },
  modeller: { label: "Модельєр", color: "bg-accent-lavender text-accent-blue" },
  miller: { label: "Фрезерувальник", color: "bg-gray-100 text-black" },
  client: {
    label: "Замовник",
    color: "bg-accent-lightgreen text-brand-default",
  },
  print: { label: "Друк", color: "text-accent-yellow bg-accent-peach" },
};
