"use client";
import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";
import { MENU_LIST } from "@/constants/sidebar.constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { checkPermission, cn } from "@/lib/utils";
import { PersonRoleValue } from "@/types/person.types";

const SideBar = ({ role }: { role: PersonRoleValue }) => {
  const pathName = usePathname();
  return (
    <div className="h-full w-full bg-white">
      <Image
        src="/img/logo.png"
        alt="logo"
        width={52}
        height={30}
        className="w-auto h-auto px-2 text-center mt-6 mb-15"
      />
      <Separator className="w-full bg-ui-border" />
      <ul className="flex flex-col">
        {MENU_LIST.map((route) => {
          const isActive = pathName.includes(route.href);
          return (
            checkPermission(route.permission, role) && (
              <Link key={route.href} href={route.href}>
                <div
                  className={cn(
                    "flex flex-col gap-0.5 items-center py-4.5 w-full text-xs transition hover:bg-brand-default",
                    isActive &&
                      "bg-brand-menu shadow-sm hover:bg-brand-default text-stone-900"
                  )}
                >
                  <Image src={route.icon} alt="logo" width={24} height={24} />
                  {route.label}
                </div>
              </Link>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
