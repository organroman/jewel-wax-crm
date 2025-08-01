import { Invoice } from "@/types/finance.types";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn, copyToClipboard } from "@/lib/utils";
import { INVOICE_STATUS_COLORS } from "@/constants/finance.constants";
import PaymentActionsMenu from "./payment-actions-menu";

export const getOrderPaymentsColumns = (
  t: (key: string) => string
): ColumnDef<Invoice>[] => [
  {
    accessorKey: "created_at",
    header: t("finance.table_headers.order_payments.created_at"),

    cell: ({ row }) => {
      const formattedDate = dayjs(row.original.created_at).format("DD.MM.YYYY");
      return <div className="text-center">{formattedDate}</div>;
    },
    size: 50,
  },
  {
    accessorKey: "invoice_url",
    header: t("finance.table_headers.order_payments.invoice_url"),

    cell: ({ row }) => {
      const url = row.original.invoice_url;
      return (
        <div className="">
          {url ? (
            <Button
              variant="ghost"
              className="cursor-pointer"
              size="icon"
              onClick={() => copyToClipboard(url)}
            >
              <CopyIcon />
            </Button>
          ) : (
            "-"
          )}
        </div>
      );
    },
    size: 300,
  },
  {
    accessorKey: "amount",
    header: t("finance.table_headers.order_payments.amount"),

    cell: ({ row }) => {
      const amount = row.original.amount;
      return <div className="text-center">{amount}</div>;
    },
    size: 50,
  },
  {
    accessorKey: "status",
    header: t("finance.table_headers.order_payments.payment_status"),

    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className={cn("text-center", INVOICE_STATUS_COLORS[status])}>
          {t(`finance.payment_status.${status}`)}
        </div>
      );
    },
    size: 50,
  },
  {
    accessorKey: "paid_at",
    header: t("finance.table_headers.order_payments.paid_at"),

    cell: ({ row }) => {
      const formattedDate = dayjs(row.original.paid_at).format("DD.MM.YYYY");
      return <div className="text-center">{formattedDate}</div>;
    },
    size: 50,
  },
  {
    accessorKey: "payment_method",
    header: t("finance.table_headers.order_payments.payment_method"),

    cell: ({ row }) => {
      const paymentMethod = row.original.payment_method;
      return (
        <div className="text-center">
          {t(`finance.payment_method.${paymentMethod}`)}
        </div>
      );
    },
    size: 50,
  },
  {
    accessorKey: "description",
    header: t("finance.table_headers.order_payments.description"),

    cell: ({ row }) => {
      return <div className="">{row.original.description}</div>;
    },
    size: 300,
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
          <PaymentActionsMenu id={row.original.id} />
        </div>
      );
    },
    size: 28,
  },
];
