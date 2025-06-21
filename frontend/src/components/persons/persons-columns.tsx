"use client";
import { Person } from "@/types/person.types";

import { InfoIcon } from "lucide-react";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ViewPersonDetails from "./view-person";
import PersonActionsMenu from "./person-actions-menu";

import { cn, getDoorAddress, getInitials } from "@/lib/utils";
import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";
import { Button } from "../ui/button";

export const getPersonsColumns = (
  t: (key: string) => string
): ColumnDef<Person>[] => [
  {
    id: "view",
    header: () => (
      <Button variant="ghost" className="has-[>svg]:p-1.5 hover:bg-transparent">
        <InfoIcon className="text-text-muted size-5" />
      </Button>
    ),
    cell: ({ row }) => {
      return <ViewPersonDetails id={row.original.id} />;
    },
    size: 36,
  },
  {
    accessorKey: "avatar_url",
    header: t("person.table_headers.avatar_url"),
    cell: ({ row }) => {
      const avatarUrl = row.original.avatar_url;
      const initials = getInitials(
        row.original.first_name,
        row.original.last_name
      );

      return (
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
    size: 65,
  },
  {
    accessorKey: "full_name",
    header: t("person.table_headers.full_name"),
    cell: ({ row }) => {
      const lastName = row.original.last_name;
      const firstName = row.original.first_name.charAt(0);
      const secondName = row.original.patronymic?.charAt(0);

      const full_name = lastName + " " + firstName + ".";
      if (secondName) full_name + { secondName } + ".";

      return <span>{full_name}</span>;
    },
    size: 100,
  },
  {
    accessorKey: "phone",
    header: t("person.table_headers.phone"),
    cell: ({ row }) => {
      const phonesQuantity = row.original.phones.length;
      const mainPhone = row.original.phones
        .filter((phone) => phone.is_main)
        .at(0);

      if (mainPhone) {
        return (
          <div className="">
            <span className="mr-2">{mainPhone.number}</span>
            {phonesQuantity >= 2 && (
              <Badge className="pr-1 px-1 justify-start rounded-full text-[10px] gap-0">
                +{phonesQuantity - 1}
              </Badge>
            )}
          </div>
        );
      }
    },
    size: 30,
  },
  {
    accessorKey: "role",
    header: t("person.table_headers.role"),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          className={cn(
            "text-xs rounded-2xl font-medium px-3.5 py-[5px]",
            PERSON_ROLE_COLORS[role.value]
          )}
        >
          {role.label}
        </Badge>
      );
    },
    size: 30,
  },
  {
    accessorKey: "city",
    header: t("person.table_headers.city"),
    cell: ({ row }) => {
      const locations = row.original.locations;
      const main = locations?.find((location) => location.is_main === true);
      if (main) {
        return <span>{main?.city_name}</span>;
      }
    },
    size: 40,
  },
  {
    accessorKey: "post",
    header: t("person.table_headers.post"),
    cell: ({ row }) => {
      const mainAddress =
        row.original.delivery_addresses.find((a) => a.is_main) ??
        row.original.delivery_addresses[0];

      const addressName =
        mainAddress?.type === "warehouse"
          ? mainAddress.np_warehouse
          : getDoorAddress(
              mainAddress?.street,
              mainAddress?.house_number,
              mainAddress?.flat_number
            );

      return <span> {addressName}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: t("person.table_headers.created_at"),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;

      const formattedDate = dayjs(date).format("DD.MM.YYYY");
      return <span>{formattedDate}</span>;
    },
    size: 30,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center">{t("person.table_headers.actions")}</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <PersonActionsMenu id={row.original.id} />
        </div>
      );
    },
    size: 28,
  },
];
