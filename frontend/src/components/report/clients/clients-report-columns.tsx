"use client";


import { ClientsReportRaw } from "@/types/report.types";
import { InfoIcon } from "lucide-react";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import ViewPersonDetails from "@/components/persons/view-person";

import { cn, getInitials } from "@/lib/utils";

export const getClientsReportColumns = (
  t: (key: string) => string
): ColumnDef<ClientsReportRaw>[] => [
  {
    id: "view",
    header: () => (
      <Button variant="ghost" className="has-[>svg]:p-1.5 hover:bg-transparent">
        <InfoIcon className="text-text-muted size-5" />
      </Button>
    ),
    cell: ({ row }) => {
      return <ViewPersonDetails id={row.original.client.id} />;
    },
    size: 36,
  },
  {
    accessorKey: "avatar_url",
    header: t("person.table_headers.avatar_url"),
    cell: ({ row }) => {
      const avatarUrl = row.original.client.avatar_url;
      const fullNameArr = row.original.client.fullname.split(" ");
      const initials = getInitials(fullNameArr[1], fullNameArr[0]);

      return (
        <Avatar>
          <AvatarImage src={avatarUrl ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
    size: 40,
  },
  {
    accessorKey: "full_name",
    header: t("person.table_headers.full_name"),
    cell: ({ row }) => {
      const fullname = row.original.client.fullname;
      return <div className="max-w-[180px] truncate">{fullname}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "phone",
    header: t("person.table_headers.phone"),
    cell: ({ row }) => {
      return row.original.client.phone;
    },
    size: 80,
  },
  {
    accessorKey: "email",
    header: t("report.clients.table_headers.email"),
    cell: ({ row }) => {
      const email = row.original.client.email;
      if (!email) {
        return <div>-</div>;
      }
      return <div>{email}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "city",
    header: t("person.table_headers.city"),
    cell: ({ row }) => {
      return row.original.client.city;
    },
    size: 100,
  },
  {
    accessorKey: "created_at",
    header: t("person.table_headers.created_at"),
    cell: ({ row }) => {
      const date = row.original.client.created_at as Date;

      const formattedDate = dayjs(date).format("DD.MM.YYYY");
      return <span>{formattedDate}</span>;
    },
    size: 40,
  },
  {
    accessorKey: "orders_amount",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.clients.table_headers.orders_amount")}
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.orders_amount;

      if (amount === 0) {
        return <div>-</div>;
      }

      return <div>{amount}</div>;
    },
    size: 40,
  },
  {
    accessorKey: "orders_in_progress",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.clients.table_headers.orders_in_progress")}
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.orders_in_progress;

      if (amount === 0) {
        return <div>-</div>;
      }

      return <div>{amount}</div>;
    },
    size: 40,
  },
  {
    accessorKey: "total_amount_paid",
    header: t("report.clients.table_headers.total_amount_paid"),
    cell: ({ row }) => {
      const amount = row.original.total_amount_paid;

      return (
        <div className={cn(amount > 0 && "text-brand-default")}>
          {amount.toFixed(2)}
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "total_debt",
    header: () => (
      <div className="whitespace-normal break-words text-center px-4">
        {t("report.clients.table_headers.total_debt")}
      </div>
    ),

    cell: ({ row }) => {
      const amount = row.original.total_debt;

      return (
        <div className={cn(amount > 0 && "text-action-alert")}>
          {amount.toFixed(2)}
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: "last_order_date",
    header: () => (
      <div className="whitespace-normal break-words text-center">
        {t("report.clients.table_headers.last_order_date")}
      </div>
    ),

    cell: ({ row }) => {
      const date = row.original.last_order_date as Date;

      if (!date) {
        return <div>-</div>;
      }

      const formattedDate = dayjs(date).format("DD.MM.YYYY");
      return <span>{formattedDate}</span>;
    },
    size: 40,
  },
];
