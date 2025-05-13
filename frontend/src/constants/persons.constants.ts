export const PERSON_FILTERS = [
  {
    param: "is_active",
    label: "Статус",
    options: [
      { label: "Активні", value: true },
      { label: "Неактивні", value: false },
    ],
  },
];
export const PERSON_ROLE_ALL = {
  label: "Всі контрагенти",
  value: "all",
  type: "person_role",
};

export const PERSON_ROLE_COLORS = {
  super_admin: "bg-gray-100 text-black",
  modeller: "bg-accent-lavender text-accent-blue",
  miller: "bg-gray-100 text-black",
  client: "bg-accent-lightgreen text-brand-default",
  print: "text-accent-yellow bg-accent-peach",
};
