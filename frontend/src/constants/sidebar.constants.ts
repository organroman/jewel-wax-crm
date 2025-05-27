import { PERMISSIONS } from "./permissions.constants";

export const MENU_LIST = [
  {
    href: "/dashboard",
    icon: "/img/dashboard.svg",
    key: "dashboard",
    permission: PERMISSIONS.DASHBOARD.VIEW,
  },
  {
    href: "/requests",
    icon: "/img/requests.svg",
    key: "requests",
    permission: PERMISSIONS.REQUESTS.VIEW,
  },

  {
    href: "/orders",
    icon: "/img/orders.svg",
    key: "orders",
    permission: PERMISSIONS.ORDERS.VIEW,
  },
  {
    href: "/finance",
    icon: "/img/finance.svg",
    key: "finance",
    permission: PERMISSIONS.FINANCE.VIEW,
  },
  {
    href: "/reports",
    icon: "/img/reports.svg",
    key: "reports",
    permission: PERMISSIONS.REPORTS.VIEW,
  },
  {
    href: "/statistic",
    icon: "/img/statistics.svg",
    key: "statistic",
    permission: PERMISSIONS.STATISTIC.VIEW,
  },
  {
    href: "/persons",
    icon: "/img/persons.svg",
    key: "persons",
    permission: PERMISSIONS.PERSONS.VIEW,
  },
];
