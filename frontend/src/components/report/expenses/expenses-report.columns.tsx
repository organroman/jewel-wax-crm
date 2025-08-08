import { ExpensesReportRaw } from "@/types/report.types";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";

export const getExpensesReportColumns = (
  t: (key: string) => string
): ColumnDef<ExpensesReportRaw>[] => [
  {
    accessorKey: "created_at",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.expenses.table_headers.date")}
      </div>
    ),

    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <div className={cn("text-center")}>
          <span>{dayjs(date).format("DD.MM.YYYY")}</span>
        </div>
      );
    },
    size: 80,
  },
  {
    id: "order",
    header: t("report.expenses.table_headers.number"),
    cell: ({ row }) => {
      const orderNumber = row.original.order?.number;
      const orderId = row.original.order?.id;

      if (!orderId) {
        return <div className="text-center">-</div>;
      }
      return (
        <a
          className=" block text-center underline text-action-plus hover:bg-transparent hover:text-indigo-400 font-medium  text-xs cursor-pointer"
          href={`orders/${orderId}`}
        >
          {orderNumber}
        </a>
      );
    },
    size: 40,
  },
  {
    accessorKey: "person",
    header: t("report.expenses.table_headers.person"),
    cell: ({ row }) => {
      const fullname = row.original.person?.fullname;
      if (!fullname) {
        return <div className="">-</div>;
      }
      return <div className="max-w-[240px] truncate">{fullname}</div>;
    },
    size: 240,
  },
  {
    accessorKey: "role",
    header: t("report.expenses.table_headers.role"),
    cell: ({ row }) => {
      const role = row.original.person?.role;
      const personRoleColor =
        role &&
        PERSON_ROLE_COLORS[role].split(" ").filter((c) => c.startsWith("text"));

      if (!role) {
        return (
          <div className="text-text-regular text-center">
            {t("person.roles.super_admin")}
          </div>
        );
      }
      return (
        <div className={cn("text-center", personRoleColor)}>
          {t(`person.roles.${role}`)}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "amount",
    header: t("report.expenses.table_headers.amount"),
    cell: ({ row }) => {
      const amount = row.original.amount;

      return <div className="text-center">-{amount}</div>;
    },
    size: 40,
  },
  {
    accessorKey: "payment_method",
    header: t("report.expenses.table_headers.payment_method"),
    cell: ({ row }) => {
      const payment_method = row.original.payment_method;

      return (
        <div>
          {t(`finance.payment_method.${payment_method}`)}
        </div>
      );
    },
    size: 60,
  },
  {
    accessorKey: "category",
    header: t("report.expenses.table_headers.category"),
    cell: ({ row }) => {
      const category = row.original.category;

      return (
        <div className="">{t(`finance.expenses_category.${category}`)}</div>
      );
    },
    size: 60,
  },
  {
    accessorKey: "description",
    header: t("report.expenses.table_headers.description"),
    cell: ({ row }) => {
      const desc = row.original.description;

      return <div className="max-w-[240px] truncate">{desc}</div>;
    },
    size: 240,
  },
];
