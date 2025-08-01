import { FinanceOrderItem } from "@/types/finance.types";

import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon } from "lucide-react";

import AllFinanceActionsMenu from "./all-finance-actions-menu";

import { cn } from "@/lib/utils";
import { PAYMENT_STATUS_COLORS } from "@/constants/orders.constants";

export const getAllFinanceColumns = (
  t: (key: string) => string
): ColumnDef<FinanceOrderItem>[] => [
  {
    id: "order_important",
    header: () => <CircleAlertIcon className={cn("size-5 text-text-light")} />,
    cell: ({ row }) => (
      <CircleAlertIcon
        className={cn(
          "size-5 text-text-light",
          row.original.order_important && "text-action-alert"
        )}
      />
    ),
    size: 28,
  },
  {
    id: "number",
    header: t("finance.table_headers.all_finance.number"),
    cell: ({ row }) => {
      const orderNumber = row.original.order_number;
      const orderId = row.original.order_id;
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
    header: t("finance.table_headers.all_finance.customer"),
    cell: ({ row }) => {
      const fullname = row.original.customer?.fullname;
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "order_amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.order_amount")},₴
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.order_amount;
      return <div className="text-center">{amount}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "order_payment_status",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.order_payment_status")}
      </div>
    ),

    cell: ({ row }) => {
      const status = row.original.order_payment_status;
      if (!status) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center", PAYMENT_STATUS_COLORS[status])}>
          {t(`finance.payment_status.${status}`)}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "modeller",
    header: t("finance.table_headers.all_finance.modeller"),
    cell: ({ row }) => {
      const fullname = row.original.modeller?.fullname;
      if (!fullname)
        return (
          <div className="text-text-light">
            {t("placeholders.not_appointed")}
          </div>
        );
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "modelling_cost",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.modelling_cost")},₴
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.modeling_cost;
      return <div className="text-center">{amount}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "modelling_payment_status",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.modelling_payment_status")}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.modeling_payment_status;
      if (!status) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn(PAYMENT_STATUS_COLORS[status])}>
          {t(`finance.payment_status.${status}`)}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "print",
    header: t("finance.table_headers.all_finance.print"),
    cell: ({ row }) => {
      const fullname = row.original.printer?.fullname;
      if (!fullname)
        return (
          <div className="text-text-light">
            {t("placeholders.not_appointed")}
          </div>
        );
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "printing_cost",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.printing_cost")},₴
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.printing_cost;
      return <div className="text-center">{amount}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "printing_payment_status",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.printing_payment_status")}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.printing_payment_status;
      if (!status) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn(PAYMENT_STATUS_COLORS[status])}>
          {t(`finance.payment_status.${status}`)}
        </div>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center">
        {t("finance.table_headers.order_payments.actions")}
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <AllFinanceActionsMenu id={row.original.order_id} />
        </div>
      );
    },
    size: 28,
  },
];
