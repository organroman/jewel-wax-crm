import { Order } from "@/types/order.types";

import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon, MoreHorizontalIcon, StarIcon } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_COLORS,
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";

export const getOrdersColumns = (
  t: (key: string) => string,
  hiddenColumns: string[] = []
): ColumnDef<Order>[] => {
  const columns: ColumnDef<Order>[] = [
    {
      id: "is_favorite",
      header: () => (
        <Button
          variant="ghost"
          className="has-[>svg]:p-1.5 hover:bg-transparent"
        >
          <StarIcon className="size-5" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            className="has-[>svg]:p-1.5 hover:bg-transparent"
          >
            <StarIcon
              className={cn(
                "size-5 fill-current stroke-brand-menu",
                row.original.is_favorite
                  ? "text-brand-default stroke-brand-default"
                  : "text-transparent"
              )}
            />
          </Button>
        );
      },
      size: 36,
    },
    {
      id: "is_important",
      header: () => (
        <Button
          variant="ghost"
          className="has-[>svg]:p-1.5 hover:bg-transparent"
        >
          <CircleAlertIcon className="size-5" />
        </Button>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:p-1.5 hover:bg-transparent"
        >
          <CircleAlertIcon
            className={cn(
              "size-5 fill-current stroke-ui-border",
              row.original.is_important
                ? "text-action-alert"
                : "text-transparent"
            )}
          />
        </Button>
      ),
      size: 36,
    },
    {
      id: "created_at",
      header: t("order.table_headers.date"),
      cell: ({ row }) => {
        const formattedDate = dayjs(row.original.created_at).format(
          "DD.MM.YYYY"
        );
        return <span>{formattedDate}</span>;
      },
      size: 50,
    },
    {
      id: "number",
      header: t("order.table_headers.number"),
      cell: ({ row }) => {
        const orderNumber = row.original.number;
        return <span>{orderNumber}</span>;
      },
      size: 40,
    },
    {
      id: "image",
      header: t("order.table_headers.photo"),
      cell: ({ row }) => {
        const imageUrl = row.original.media[0]?.url || "";

        return imageUrl ? (
          <Image src={imageUrl} width={30} height={30} alt="img" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-text-light"></div>
        );
      },
      size: 36,
    },
    {
      id: "name",
      header: t("order.table_headers.name"),
      cell: ({ row }) => {
        const name = row.original.name;
        return <span>{name}</span>;
      },
      size: 80,
    },
    {
      id: "customer",
      header: t("order.table_headers.customer"),
      cell: ({ row }) => {
        const customer = row.original.customer.fullname;
        return <span>{customer}</span>;
      },
      size: 100,
    },
    {
      id: "amount",
      header: t("order.table_headers.amount"),
      size: 50,
      cell: ({ row }) => {
        return row.original.amount;
      },
    },
    {
      id: "payment_status",
      header: t("order.table_headers.payment_status"),
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              PAYMENT_STATUS_COLORS[row.original.payment_status || "unpaid"]
            )}
          >
            {row.original.payment_status}
          </span>
        );
      },
    },
    {
      id: "stage",
      header: t("order.table_headers.stage"),
      cell: ({ row }) => {
        const stage = row.original.active_stage;
        return (
          <Badge
            className={cn(
              "text-xs rounded-2xl font-medium",
              STAGE_COLORS[stage]
            )}
          >
            {t(`order.stages.${stage}`)}
          </Badge>
        );
      },
      size: 50,
    },
    {
      id: "stage_status",
      header: t("order.table_headers.stage_status"),
      cell: ({ row }) => {
        const status = row.original.stage_status;
        if (status)
          return (
            <span
              className={cn(
                "font-medium",
                status && STAGE_STATUS_COLORS[status]
              )}
            >
              {t(`order.stage_statuses.${status}`)}
            </span>
          );
      },
      size: 40,
    },
    {
      id: "processing_days",
      header: t("order.table_headers.days"),
      cell: ({ row }) => {
        const days = row.original.processing_days;
        return days;
      },
      size: 16,
    },
    {
      id: "notes",
      header: t("order.table_headers.comment"),
      cell: ({ row }) => {
        const comment = row.original.notes;
        return comment;
      },
      size: 50,
    },
    {
      id: "actions",
      header: t("order.table_headers.actions"),
      cell: ({ row }) => {
        return (
          // <Button>
          <MoreHorizontalIcon />
          // </Button>
        );
      },
      size: 24,
    },
  ];
  return columns.filter((col) => !hiddenColumns.includes(col.id ? col.id : ""));
};
