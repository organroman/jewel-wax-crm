"use client";
import { TabOption } from "@/types/shared.types";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRequest } from "@/api/request/use-request";

import CustomTabs from "@/components/shared/custom-tabs";
import { Separator } from "@/components/ui/separator";

import Conversations from "@/components/requests/convresations";
import ConversationRoom from "@/components/requests/conversation-room";

import { CHANEL_SOURCE } from "@/constants/enums.constants";
import { Loader } from "lucide-react";

interface RequestsClientProps {
  userId: number;
}

const RequestsClient = ({ userId }: RequestsClientProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const channelsWithAll = ["all", ...CHANEL_SOURCE];
  const tabsOptions = channelsWithAll.map((c) => ({
    value: c,
    label: t(`request.channels.${c}`),
  }));

  const conversationId = searchParams.get("id");

  const tabParam = searchParams.get("channel");
  const currentTab = tabsOptions?.find((t) => t.value === tabParam) ?? {
    value: "all",
    label: t("request.channels.all"),
  };

  const [selectedTab, setSelectedTab] = useState<TabOption>(currentTab);

  const { data, isLoading } = useRequest.getConversations({
    enabled: Boolean(selectedTab),
  });

  const currentConversation = data?.find(
    (c) => c.id === Number(conversationId)
  );

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!selectedTab || selectedTab.value === value) return;

    const selected = tabsOptions.find((t) => t.value === value);
    if (!selected) {
      return;
    }

    if (selected.value === "all") {
      params.delete("channel");
    } else params.set("channel", value);
    router.replace(`?${params.toString()}`);
    setSelectedTab(selected);
  };
  return (
    <div className="h-full flex flex-col">
      <CustomTabs
        tabsOptions={tabsOptions}
        handleChange={handleChange}
        selectedTab={selectedTab}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="flex-1 overflow-hidden flex flex-row mt-4 bg-ui-sidebar">
        {isLoading && <Loader className="text-brand-default animate-spin" />}
        <Conversations conversations={data ?? []} userId={userId} />
        {currentConversation ? (
          <ConversationRoom
            conversation={currentConversation}
            userId={userId}
          />
        ) : (
          <div className="w-full h-full overflow-hidden p-2.5 bg-ui-row-odd rounded-sm flex flex-col gap-2.5 items-center justify-center">
            <h3 className="text-brand-dark text-xl font-semibold">
              {t("messages.info.no_conversation")}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsClient;
