import { FinanceModellerPaymentItem } from "@/types/finance.types";

import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon } from "lucide-react";
import dayjs from "dayjs";

import ModellerPaymentsActionsMenu from "./modeller-payments-actions-menu";

import { cn } from "@/lib/utils";
import { PAYMENT_STATUS_COLORS } from "@/constants/orders.constants";

export const getModellerPaymentsColumns = (
  t: (key: string) => string
): ColumnDef<FinanceModellerPaymentItem>[] => [
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
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.modeller")}
      </div>
    ),

    cell: ({ row }) => {
      const modeller = row.original.modeller;

      return modeller?.fullname;
    },
    size: 160,
  },
  {
    accessorKey: "modelling_cost",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.all_finance.modelling_cost")},₴
      </div>
    ),

    cell: ({ row }) => {
      const modellingCost = row.original.modelling_cost;

      if (!modellingCost) {
        return <div className="text-center">-</div>;
      }
      return <div className={cn("text-center")}>{modellingCost}</div>;
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
      const status = row.original.modelling_payment_status;
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
    accessorKey: "modelling_payment_date",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.modeller_payments.payment_date")}
      </div>
    ),

    cell: ({ row }) => {
      const paymentDate = row.original.last_payment_date;
      if (!paymentDate) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          {dayjs(paymentDate).format("DD.MM.YYYY")}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "last_payment_comment",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.modeller_payments.comment")}
      </div>
    ),

    cell: ({ row }) => {
      const comment = row.original.last_payment_comment;
      if (!comment) {
        return <div className="text-center">-</div>;
      }
      return <div>{comment}</div>;
    },
    size: 140,
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
          <ModellerPaymentsActionsMenu id={row.original.order_id} />
        </div>
      );
    },
    size: 28,
  },
];
