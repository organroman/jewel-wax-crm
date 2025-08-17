"use client";
import { PersonRoleValue } from "@/types/person.types";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { checkPermission, cn } from "@/lib/utils";
import { MENU_LIST } from "@/constants/sidebar.constants";

const MobileNavBar = ({ role }: { role: PersonRoleValue }) => {
  const pathName = usePathname();
  const activeItemRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

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
    <ul className="flex w-full  overflow-y-hidden overflow-x-auto pb-2 px-2">
      {MENU_LIST.map((route) => {
        const isActive = pathName.includes(route.href);
        const Icon = route.icon;
        return (
          checkPermission(route.permission, role) && (
            <Link key={route.href} href={route.href} className="flex">
              <div
                ref={isActive ? activeItemRef : null}
                className={cn(
                  "flex min-w-[78px] flex-col gap-0.5 items-center rounded-xs px-2.5 py-4.5 w-full text-xs transition hover:bg-brand-default",
                  isActive && 
                    "bg-brand-menu shadow-sm hover:bg-brand-default text-brand-dark"
                )}
              >
                {
                  <Icon
                    className={cn(
                      "text-text-regular",
                      isActive && "text-brand-dark"
                    )}
                  />
                }
                {t(`main_menu.${route.key}`)}
              </div>
            </Link>
          )
        );
      })}
    </ul>
  );
};

export default MobileNavBar;
