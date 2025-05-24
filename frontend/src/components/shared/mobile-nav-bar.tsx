"use client";
import { PersonRoleValue } from "@/types/person.types";

import Image from "next/image";
import React, { useEffect, useRef } from "react";

import { MENU_LIST } from "@/constants/sidebar.constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { checkPermission, cn } from "@/lib/utils";

const MobileNavBar = ({ role }: { role: PersonRoleValue }) => {
  const pathName = usePathname();
  const activeItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathName]);

  return (
    <ul className="flex w-full gap-5 overflow-x-auto pb-4 px-2">
      {MENU_LIST.map((route) => {
        const isActive = pathName.includes(route.href);
        return (
          checkPermission(route.permission, role) && (
            <Link key={route.href} href={route.href} className="flex">
              <div
                ref={isActive ? activeItemRef : null}
                className={cn(
                  "flex flex-col gap-0.5 items-center rounded-xs py-4.5 w-full text-xs transition hover:bg-brand-default",
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
  );
};

export default MobileNavBar;
