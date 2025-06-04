"use client";

import { PersonRoleValue } from "@/types/person.types";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";
import { MENU_LIST } from "@/constants/sidebar.constants";

import { checkPermission, cn } from "@/lib/utils";
import { useTheme } from "next-themes";

import LogoIcon from "@/assets/icons/logo.svg";

const SideBar = ({ role }: { role: PersonRoleValue }) => {
  const pathName = usePathname();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-center mt-3 mb-10">
        <LogoIcon
          fill={theme === "dark" ? "white" : "black"}
          className="self-center"
        />
      </div>
      <Separator className="w-full bg-ui-border" />
      <ul className="flex flex-col">
        {MENU_LIST.map((route) => {
          const isActive = pathName.includes(route.href);
          const Icon = route.icon;
          return (
            checkPermission(route.permission, role) && (
              <Link key={route.href} href={route.href}>
                <div
                  className={cn(
                    "flex flex-col text-text-regular gap-0.5 items-center py-4.5 w-full text-xs transition rounded-sm hover:bg-brand-default",
                    isActive &&
                      "bg-brand-menu shadow-sm hover:bg-brand-default text-stone-900"
                  )}
                >
                  {
                    <Icon
                      className={cn(
                        "text-text-regular",
                        isActive && "text-stone-900"
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
    </div>
  );
};

export default SideBar;
