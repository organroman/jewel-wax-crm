"use client";
import { Person } from "@/types/person.types";

import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";
import { cn } from "@/lib/utils";

export const personsColumns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 48,
  },
  {
    accessorKey: "avatar_url",
    header: "Фото",
    cell: ({ row }) => {
      const avatarUrl = row.original.avatar_url;
      const initials =
        row.original.first_name.charAt(0).toUpperCase() +
        row.original.last_name.charAt(0).toUpperCase();

      return (
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
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
              <Badge className="p-0.5 rounded-4xl text-[10px]">
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
            "text-[10px] rounded-md",
            PERSON_ROLE_COLORS[role.value]
          )}
        >
          {role.label}
        </Badge>
      );
    },
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
];
