"use client";

import { PersonRoleValue } from "@/types/person.types";
import React from "react";
import { useTranslation } from "react-i18next";

import { useUnreadStore } from "@/stores/use-unread-store";

import { Badge } from "../ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

import BingIcon from "../../assets/icons/notification-bing.svg";

import { splitUnread } from "@/lib/split-unread";

interface NotificationsProps {
  role: PersonRoleValue;
}
const Notifications = ({ role }: NotificationsProps) => {
  const { t } = useTranslation();
  const { byConversation } = useUnreadStore((s) => s);
  const { internalTotal, externalTotal } = splitUnread(byConversation);

  const canViewExternal = role === "super_admin";

  const total = internalTotal + (canViewExternal ? externalTotal : 0);

  const showNoMessage = !internalTotal && (!externalTotal || !canViewExternal);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger>
          <BingIcon className="text-white size-7 stroke-1" />
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1">
          {internalTotal > 0 && (
            <span>
              {t("topbar.chat")}: {internalTotal}
            </span>
          )}
          {externalTotal > 0 && canViewExternal && (
            <span>
              {t("topbar.requests")}: {externalTotal}
            </span>
          )}
          {showNoMessage && <span>{t("messages.info.no_new_messages")}</span>}
        </TooltipContent>
      </Tooltip>
      {total > 0 && (
        <Badge className="absolute -top-1.5 -right-1.5 bg-action-alert rounded-full w-5 h-5 text-[10px] font-semibold text-white">
          {total}
        </Badge>
      )}
    </div>
  );
};

export default Notifications;
