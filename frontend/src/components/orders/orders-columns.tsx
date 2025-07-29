import { Order } from "@/types/order.types";
import { PersonRoleValue } from "@/types/person.types";

import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon, StarIcon } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import OrderFavorite from "./order-favorite";
import OrderImportant from "./order-important";
import OrderActionsMenu from "./order-actions-menu";
import ViewOrder from "./view-order";

import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_COLORS,
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";

export const getOrdersColumns = (
  t: (key: string) => string,
  userRole: PersonRoleValue
): ColumnDef<Order>[] => {
  const isAdmin = userRole === "super_admin";

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
          <OrderFavorite
            is_favorite={row.original.is_favorite}
            orderId={row.original.id}
          />
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
        <OrderImportant
          orderId={row.original.id}
          is_important={row.original.is_important}
          disabled={!isAdmin}
        />
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
        return (
          <ViewOrder orderId={row.original.id} orderNumber={orderNumber} />
        );
      },
      size: 40,
    },
    {
      id: "image",
      header: t("order.table_headers.photo"),
      cell: ({ row }) => {
        const imageUrl = row.original.media.at(0)?.url || "";

        return imageUrl ? (
          <div className="w-8 h-8 rounded-full border border-ui-border">
            <img
              src={imageUrl}
              alt="img"
              className="text-xs rounded-full w-8 h-8 aspect-square"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-text-light/35 border border-ui-border"></div>
        );
      },

      size: 36,
    },
    {
      id: "name",
      header: t("order.table_headers.name"),
      cell: ({ row }) => {
        const name = row.original.name;
        return <span className="block max-w-[160px] truncate">{name}</span>;
      },
      size: 160,
    },
    {
      id: "customer",
      header: t("order.table_headers.customer"),
      cell: ({ row }) => {
        const customer = `${row.original.customer.last_name} ${row.original.customer.first_name}`;
        return <span>{customer}</span>;
      },
      size: 140,
    },
    {
      id: "modeller",
      header: t("order.table_headers.modeller"),
      cell: ({ row }) => {
        const modeller = row.original.modeller?.fullname;
        return modeller;
      },
      size: 140,
    },
    {
      id: "miller",
      header: t("order.table_headers.miller"),
      cell: ({ row }) => {
        const miller = row.original.miller?.fullname;
        return miller;
      },
      size: 140,
    },
    {
      id: "printer",
      header: t("order.table_headers.printer"),
      cell: ({ row }) => {
        const printer = row.original.printer?.fullname;
        return printer;
      },
      size: 140,
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
      id: "modeling_cost",
      header: t("order.table_headers.modeling_cost"),
      cell: ({ row }) => {
        return row.original.modeling_cost;
      },
      size: 60,
    },
    {
      id: "payment_status",
      header: t("order.table_headers.payment_status"),
      cell: ({ row }) => {
        return (
          <div
            className={cn(
              "text-center",
              PAYMENT_STATUS_COLORS[row.original.payment_status || "unpaid"]
            )}
          >
            {t(
              `order.filters.payment_status.options.${row.original.payment_status}`
            )}
          </div>
        );
      },
      size: 50,
    },
    {
      id: "active_stage",
      header: t("order.table_headers.stage"),
      cell: ({ row }) => {
        const stage = row.original.active_stage;
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
      id: "active_stage_status",
      header: t("order.table_headers.stage_status"),
      cell: ({ row }) => {
        const status = row.original.active_stage_status;
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
    // specific stage for miller/ modeller
    {
      id: "specific_stage",
      header: t("order.table_headers.stage"),
      cell: ({ row }) => {
        const stage = row.original.stages[0].stage;
        return (
          <Badge
            className={cn(
              "text-[10px] rounded-2xl font-medium",
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
      id: "specific_stage_status",
      header: t("order.table_headers.stage_status"),
      cell: ({ row }) => {
        const status = row.original.stages[0].status;
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
      size: 100,
    },

    {
      id: "processing_days",
      header: t("order.table_headers.days"),
      cell: ({ row }) => {
        const days = row.original.processing_days;
        return <div className="text-center">{days}</div>;
      },
      size: 16,
    },
    {
      id: "notes",
      header: t("order.table_headers.comment"),
      cell: ({ row }) => {
        const comment = row.original.notes;
        return <span className="block max-w-[240px] truncate">{comment}</span>;
      },
      size: 240,
    },
    {
      id: "actions",
      header: t("order.table_headers.actions"),
      cell: ({ row }) => {
        return <OrderActionsMenu id={row.original.id} />;
      },
      size: 24,
    },
  ];
  return columns;
};
