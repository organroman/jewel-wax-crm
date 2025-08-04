import { FinanceTransaction } from "@/types/finance.types";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

export const getTransactionsColumns = (
  t: (key: string) => string
): ColumnDef<FinanceTransaction>[] => [
  {
    accessorKey: "created_at",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("dictionary.date")}
      </div>
    ),

    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <div className={cn("text-center")}>
          {dayjs(date).format("DD.MM.YYYY HH:MM")}
        </div>
      );
    },
    size: 80,
  },

  {
    id: "order_number",
    header: t("finance.table_headers.expenses.order_number"),
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
    accessorKey: "amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.expenses.amount")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.amount;
      const transactionType = row.original.type;

      const expenseType = transactionType === "expense";
      const invoiceIssued = transactionType === "invoice_issued";
      const invoicePaid = transactionType === "invoice_paid";

      if (invoiceIssued) {
        return <div className="text-center">{amount}</div>;
      }
      if (invoicePaid) {
        return <div className="text-center text-brand-default">+{amount}</div>;
      }

      return <div className="text-center text-action-minus">-{amount}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "type",
    header: t("finance.transaction_type"),
    cell: ({ row }) => {
      const type = row.original.type;
      return <div className="">{t(`finance.transactions_type.${type}`)}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "payment_method",
    header: t("finance.table_headers.order_payments.payment_method"),
    cell: ({ row }) => {
      const payment_method = row.original.payment_method;
      return (
        <div className="">{t(`finance.payment_method.${payment_method}`)}</div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "person",
    header: t("person.person"),
    cell: ({ row }) => {
      const fullname = row.original.person?.fullname;

      if (!fullname) {
        return <div className="max-w-[180px] text-center">-</div>;
      }
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },

  {
    accessorKey: "description",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.expenses.description")}
      </div>
    ),

    cell: ({ row }) => {
      const comment = row.original.description;
      if (!comment) {
        return <div className="text-center">-</div>;
      }
      return <div>{comment}</div>;
    },
    size: 140,
  },
];
