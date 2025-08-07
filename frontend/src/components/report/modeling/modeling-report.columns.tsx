import { ModellingReportRaw } from "@/types/report.types";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_COLORS,
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";

export const getModelingReportColumns = (
  t: (key: string) => string
): ColumnDef<ModellingReportRaw>[] => [
  {
    id: "number",
    header: t("report.modeling.table_headers.number"),
    cell: ({ row }) => {
      const orderNumber = row.original.number;
      const orderId = row.original.id;
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
    accessorKey: "modeller",
    header: t("report.modeling.table_headers.person"),
    cell: ({ row }) => {
      const fullname = row.original.modeller.fullname;
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "modeling_cost",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.modeling.table_headers.modeling_cost")},₴
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.modelling_cost;
      return <div className="text-center">{amount}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "modeling_payment_status",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.modeling.table_headers.payment_status")}
      </div>
    ),

    cell: ({ row }) => {
      const status = row.original.modeling_payment_status;
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
    accessorKey: "order_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.modeling.table_headers.order_stage")}
      </div>
    ),

    cell: ({ row }) => {
      const stage = row.original.order_stage;
      return (
        <div className="text-center">
          <Badge
            className={cn(
              "text-[10px] rounded-2xl font-medium",
              STAGE_COLORS[stage]
            )}
          >
            {t(`order.stages.${stage}`)}
          </Badge>
        </div>
      );
    },
    size: 50,
  },
  {
    id: "stage_status",
    header: t("report.modeling.table_headers.stage_status"),
    cell: ({ row }) => {
      const status = row.original.stage_status;
      if (status)
        return (
          <div
            className={cn(
              "font-medium text-center",
              status && STAGE_STATUS_COLORS[status]
            )}
          >
            {t(`order.stage_statuses.${status}`)}
          </div>
        );
    },
    size: 40,
  },
  {
    accessorKey: "cash_amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.cash")}
      </div>
    ),

    cell: ({ row }) => {
      const cash = row.original.cash_payments_amount;
      if (!cash) {
        return <div className="text-center">-</div>;
      }
      return <div className={cn("text-center text-brand-default")}>{cash}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "cash_payment_date",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.cash_paid_at")}
      </div>
    ),

    cell: ({ row }) => {
      const paymentDate = row.original.cash_payment_date;
      const payments = row.original.cash_amount;
      if (!paymentDate) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          <span>{dayjs(paymentDate).format("DD.MM.YYYY")}</span>
          {payments && payments > 1 && (
            <Badge className="pr-1 px-1 justify-start rounded-full text-[10px] gap-0">
              +{payments - 1}
            </Badge>
          )}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "card_amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.card_transfer")}
      </div>
    ),

    cell: ({ row }) => {
      const card = row.original.card_payments_amount;
      if (!card) {
        return <div className="text-center">-</div>;
      }
      return <div className={cn("text-center text-brand-default")}>{card}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "card_payment_date",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.card_transfer_paid_at")}
      </div>
    ),

    cell: ({ row }) => {
      const paymentDate = row.original.card_payment_date;
      const payments = row.original.card_amount;
      if (!paymentDate) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          <span className="mr-2">
            {dayjs(paymentDate).format("DD.MM.YYYY")}
          </span>
          {payments && payments > 1 && (
            <Badge className="pr-1 px-1 justify-start rounded-full text-[10px] gap-0">
              +{payments - 1}
            </Badge>
          )}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "bank_amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.bank_transfer")}
      </div>
    ),

    cell: ({ row }) => {
      const bank = row.original.bank_payments_amount;
      if (!bank) {
        return <div className="text-center">-</div>;
      }
      return <div className={cn("text-center text-brand-default")}>{bank}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "bank_payment_date",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.bank_transfer_paid_at")}
      </div>
    ),

    cell: ({ row }) => {
      const paymentDate = row.original.bank_payment_date;
      const payments = row.original.bank_amount;
      if (!paymentDate) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className={cn("text-center")}>
          <span className="mr-2">
            {dayjs(paymentDate).format("DD.MM.YYYY")}
          </span>
          {payments && payments > 1 && (
            <Badge className="pr-1 px-1 justify-start rounded-full text-[10px] gap-0">
              +{payments - 1}
            </Badge>
          )}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "debt",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.debt")}
      </div>
    ),

    cell: ({ row }) => {
      const debt = row.original.debt;
      if (!debt) {
        return <div className="text-center">-</div>;
      }
      return <div className={cn("text-center text-action-minus")}>{debt}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "last_payment_comment",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("finance.table_headers.client_payments.comment")}
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
];
