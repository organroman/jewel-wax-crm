"use client";
import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";
import { MENU_LIST } from "@/constants/sidebar.constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SideBar = () => {
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
      <Separator className="w-full" />
      <ul className="flex flex-col">
        {MENU_LIST.map((route) => {
          const pathnameParts = pathName.split("/");
          const pathNameForCompare =
            "/" +
            pathnameParts[1] +
            (pathnameParts[2] ? "/" + pathnameParts[2] : "");

          const isActive = pathNameForCompare === route.href;
          return (
            // hasPermission(route.permission, role) && (
            <Link key={route.href} href={route.href}>
              <div
                className={cn(
                  "flex flex-col gap-0.5 items-center py-4.5 w-full text-xs hover:bg-emerald-100",
                  isActive &&
                    "bg-emerald-200 shadow-sm hover:opacity-80 text-stone-900"
                )}
              >
                <Image src={route.icon} alt="logo" width={24} height={24} />
                {route.label}
              </div>
            </Link>
            // )
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
