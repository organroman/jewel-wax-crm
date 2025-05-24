import { PERMISSIONS } from "./permissions.constants";

export const MENU_LIST = [
  {
    label: "Дашбоард", // todo: messages
    href: "/dashboard",
    icon: "/img/dashboard.svg",

    permission: PERMISSIONS.DASHBOARD.VIEW,
  },
  {
    label: "Заявки",
    href: "/requests",
    icon: "/img/requests.svg",
    permission: PERMISSIONS.REQUESTS.VIEW,
  },

  {
    label: "Завдання",
    href: "/orders",
    icon: "/img/orders.svg",

    permission: PERMISSIONS.ORDERS.VIEW,
  },
  {
    label: "Фінанси",
    href: "/finance",
    icon: "/img/finance.svg",

    permission: PERMISSIONS.FINANCE.VIEW,
  },
  {
    label: "Звіти",
    href: "/reports",
    icon: "/img/reports.svg",

    permission: PERMISSIONS.REPORTS.VIEW,
  },
  {
    label: "Статистика",
    href: "/statistic",
    icon: "/img/statistics.svg",

    permission: PERMISSIONS.STATISTIC.VIEW,
  },
  {
    label: "Контрагенти",
    href: "/persons",
    icon: "/img/persons.svg",

    permission: PERMISSIONS.PERSONS.VIEW,
  },
];
