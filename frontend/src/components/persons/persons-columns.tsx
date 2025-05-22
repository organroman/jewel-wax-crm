"use client";
import { Person } from "@/types/person.types";

import { InfoIcon } from "lucide-react";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ViewPersonDetails from "./view-person";
import PersonActionsMenu from "./person-actions-menu";

import { cn, getInitials } from "@/lib/utils";
import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";

export const personsColumns: ColumnDef<Person>[] = [
  {
    id: "view",
    header: () => <InfoIcon size={20} className="text-text-muted" />,
    cell: ({ row }) => {
      return <ViewPersonDetails id={row.original.id} />;
    },
    size: 28,
  },
  {
    accessorKey: "avatar_url",
    header: "Фото",
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
    size: 48,
  },
  {
    accessorKey: "full_name",
    header: "ПІБ",
    cell: ({ row }) => {
      const lastName = row.original.last_name;
      const firstName = row.original.first_name.charAt(0);
      const secondName = row.original.patronymic?.charAt(0);

      const full_name = lastName + " " + firstName + ".";
      if (secondName) full_name + { secondName } + ".";

      return <span>{full_name}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Телефон",
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
  },
  {
    accessorKey: "role",
    header: "Роль",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          className={cn(
            "text-xs rounded-2xl font-medium px-3.5 py-1.5",
            PERSON_ROLE_COLORS[role.value]
          )}
        >
          {role.label}
        </Badge>
      );
    },
    size: 76,
  },
  {
    accessorKey: "city",
    header: "Місто",
    cell: ({ row }) => {
      const locations = row.original.locations;
      const main = locations?.find((location) => location.is_main === true);
      if (main) {
        return <span>{main?.city_name}</span>;
      }
    },
  },
  {
    accessorKey: "post",
    header: "Відділення пошти",
    cell: ({ row }) => {
      return (
        <span> {row.original.delivery_addresses?.at(0)?.address_line}</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Створено",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;

      const formattedDate = dayjs(date).format("DD.MM.YYYY");
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Дії</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <PersonActionsMenu person={row.original} />
        </div>
      );
    },
    size: 28,
  },
];
