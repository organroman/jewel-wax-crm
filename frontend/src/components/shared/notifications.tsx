"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useUnreadStore } from "@/stores/use-unread-store";

import { Badge } from "../ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

import { splitUnread } from "@/lib/split-unread";

const Notifications = () => {
  const { t } = useTranslation();
  const { total, byConversation } = useUnreadStore((s) => s);
  const { internalTotal, externalTotal } = splitUnread(byConversation);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger>
          <Bell className="text-white size-7 stroke-1" />
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1">
          {internalTotal > 0 && (
            <span>
              {t("topbar.chat")}: {internalTotal}
            </span>
          )}
          {externalTotal > 0 && (
            <span>
              {t("topbar.requests")}: {externalTotal}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
      <Badge className="absolute -top-1.5 -right-1.5 bg-action-alert rounded-full w-5 h-5 text-[10px] font-semibold text-white">
        {total}
      </Badge>
    </div>
  );
};

export default Notifications;
