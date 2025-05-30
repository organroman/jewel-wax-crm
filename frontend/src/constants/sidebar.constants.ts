import { PERMISSIONS } from "./permissions.constants";
import DashboardIcon from "../assets/icons/dashboard.svg";
import RequestIcon from "../assets/icons/requests.svg";
import OrderIcon from "../assets/icons/orders.svg";
import FinanceIcon from "../assets/icons/finance.svg";
import ReportIcon from "../assets/icons/reports.svg";
import StatisticsIcon from "../assets/icons/statistics.svg";
import PersonsIcon from "../assets/icons/persons.svg";

export const MENU_LIST = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    permission: PERMISSIONS.DASHBOARD.VIEW,
  },
  {
    href: "/requests",
    icon: RequestIcon,
    key: "requests",
    permission: PERMISSIONS.REQUESTS.VIEW,
  },

  {
    href: "/orders",
    icon: OrderIcon,
    key: "orders",
    permission: PERMISSIONS.ORDERS.VIEW,
  },
  {
    href: "/finance",
    icon: FinanceIcon,
    key: "finance",
    permission: PERMISSIONS.FINANCE.VIEW,
  },
  {
    href: "/reports",
    icon: ReportIcon,
    key: "reports",
    permission: PERMISSIONS.REPORTS.VIEW,
  },
  {
    href: "/statistic",
    icon: StatisticsIcon,
    key: "statistic",
    permission: PERMISSIONS.STATISTIC.VIEW,
  },
  {
    href: "/persons",
    icon: PersonsIcon,
    key: "persons",
    permission: PERMISSIONS.PERSONS.VIEW,
  },
];
