import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

import { OrderReportRaw } from "@/types/report.types";
import {
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";
import { Badge } from "@/components/ui/badge";

export const getOrdersReportColumns = (
  t: (key: string) => string
): ColumnDef<OrderReportRaw>[] => [
  {
    id: "number",
    header: t("report.orders.table_headers.number"),
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
    accessorKey: "created_at",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.orders.table_headers.date")}
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
    accessorKey: "competed_at",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.orders.table_headers.completed_at")}
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.completed_at
        ? dayjs(row.original.completed_at).format("DD.MM.YYYY")
        : null;
      if (!date) {
        return <div className="">-</div>;
      }
      return <div className="">{date}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "media",
    header: t("report.orders.table_headers.media"),
    cell: ({ row }) => {
      const media = row.original.media;

      return media ? (
        <div className="w-8 h-8 rounded-full border border-ui-border">
          <img
            src={media}
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
    header: t("report.orders.table_headers.name"),
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="block max-w-[160px] truncate">{name}</span>;
    },
    size: 160,
  },
  {
    id: "customer",
    header: t("report.orders.table_headers.customer"),
    cell: ({ row }) => {
      const customer = row.original.customer.fullname;
      return <span>{customer}</span>;
    },
    size: 140,
  },
  {
    id: "active_stage",
    header: t("report.orders.table_headers.stage"),
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
    header: t("report.orders.table_headers.stage_status"),
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
  {
    accessorKey: "new_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center text-brand-default">
        {t("report.orders.table_headers.stage_days.new")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.stagesDays.new;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "modeling_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center text-accent-blue ">
        {t("report.orders.table_headers.stage_days.modeling")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.stagesDays.modeling;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "milling_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center ">
        {t("report.orders.table_headers.stage_days.milling")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.stagesDays.milling;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "printing_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center text-accent-violet ">
        {t("report.orders.table_headers.stage_days.printing")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.stagesDays.printing;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "delivery_stage",
    header: () => (
      <div className="whitespace-normal break-words text-center text-accent-red ">
        {t("report.orders.table_headers.stage_days.delivery")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.stagesDays.delivery;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "processing_days",
    header: () => (
      <div className="whitespace-normal break-words text-center ">
        {t("report.orders.table_headers.processing_days")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.processing_days;
      return (
        <div className={cn("text-center")}>
          <span>{amount ? amount : "-"}</span>
        </div>
      );
    },
    size: 40,
  },
];
