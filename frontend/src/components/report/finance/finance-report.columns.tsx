import { FinanceReportRaw } from "@/types/report.types";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

export const getFinanceReportColumns = (
  t: (key: string) => string
): ColumnDef<FinanceReportRaw>[] => [
  {
    accessorKey: "created_at",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.date")}
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
    header: t("report.finance.table_headers.number"),
    cell: ({ row }) => {
      const orderNumber = row.original.number;
      const orderId = row.original.id;

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
    accessorKey: "customer",
    header: t("report.finance.table_headers.customer"),
    cell: ({ row }) => {
      const fullname = row.original.customer?.fullname;
      if (!fullname) {
        return <div className="">-</div>;
      }
      return <div className="max-w-[240px] truncate">{fullname}</div>;
    },
    size: 240,
  },

  {
    accessorKey: "amount",

    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.amount")},₴
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.amount;

      return <div className="text-center">{amount}</div>;
    },
    size: 40,
  },
  {
    accessorKey: "paid",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.paid")},₴
      </div>
    ),
    cell: ({ row }) => {
      const paid = row.original.paid;

      return (
        <div className={cn("text-center ", paid > 0 && "text-brand-default")}>
          {paid.toFixed(2)}
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "debt",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.debt")},₴
      </div>
    ),
    cell: ({ row }) => {
      const debt = row.original.debt;

      return (
        <div className={cn("text-center", debt > 0 && "text-action-minus")}>
          {debt.toFixed(2)}
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "actual_expenses",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.actual_expenses")},₴
      </div>
    ),
    cell: ({ row }) => {
      const actual_expenses = row.original.actual_expenses;

      return (
        <div className={cn("text-center")}>{actual_expenses.toFixed(2)}</div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "actual_profit",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.actual_profit")},₴
      </div>
    ),
    cell: ({ row }) => {
      const actual_profit = row.original.actual_profit;

      return (
        <div className={cn("text-center")}>{actual_profit.toFixed(2)}</div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "actual_profitability",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.actual_profitability")}
      </div>
    ),
    cell: ({ row }) => {
      const actual_profitability = row.original.actual_profitability;

      if (!actual_profitability) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          {actual_profitability.toFixed(2)}%
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "planed_expenses",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.planed_expenses")},₴
      </div>
    ),
    cell: ({ row }) => {
      const planed_expenses = row.original.planed_expenses;

      return (
        <div className={cn("text-center")}>{planed_expenses.toFixed(2)}</div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "planed_profit",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.planed_profit")},₴
      </div>
    ),
    cell: ({ row }) => {
      const planed_profit = row.original.planed_profit;

      return (
        <div className={cn("text-center")}>{planed_profit.toFixed(2)}</div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "planed_profitability",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.finance.table_headers.planed_profitability")}
      </div>
    ),
    cell: ({ row }) => {
      const planed_profitability = row.original.planed_profitability;
      if (!planed_profitability) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          {planed_profitability.toFixed(2)}%
        </div>
      );
    },
    size: 40,
  },
];
