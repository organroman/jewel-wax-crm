export const STATIC_PERSON_FILTERS = [
  {
    param: "is_active",
    key: "status",
    options: [
      { key: "active", value: true },
      { key: "inactive", value: false },
    ],
  },
];

export const PERSON_ROLE_ALL = {
  key: "all",
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

export const PERSON_CARD_TABS_LIST = [
  {
    value: "general_info",
    key: "general_info",
  },
  {
    key: "changes_history",
    value: "changes_history",
  },
  {
    key: "orders_history",
    value: "orders_history",
  },
  { value: "new", key: "new" },
];

export const MESSENGERS_SOURCE_ICONS = {
  telegram: "/img/telegram.svg",
  viber: "/img/viber.svg",
  facebook: "/img/facebook.svg",
  instagram: "/img/insta.svg",
  whatsapp: "/img/whatsApp.svg",
};
