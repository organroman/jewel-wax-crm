"use client";
import { useEffect } from "react";
import { getSocket } from "@/socket/socket";

import type { BadgePayload } from "@/types/unread.types";
import { useUnreadStore } from "@/stores/use-unread-store";
import { useUnread } from "@/api/unread/use-unread";

export default function UnreadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setBadges = useUnreadStore((s) => s.setBadges);
  const { data, isSuccess } = useUnread.getUnread();

  useEffect(() => {
    if (data && isSuccess) {
      setBadges(data);
    }

    const socket = getSocket();
    if (!socket) return;
    const onBadge = (p: BadgePayload) => {
      setBadges(p);
    };

    socket.on("notif:badge", onBadge);

    return () => {
      socket.off("notif:badge", onBadge);
    };
  }, [setBadges]);

  return <>{children}</>;
}
