
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/socket/socket";
import { BadgePayload } from "@/types/unread.types";

export function useExternalChat({
  conversationId,
  onNewMessage,
  getLastMessageId,
}: {
  conversationId: number;
  onNewMessage: (payload: any) => void;
  getLastMessageId: () => number | undefined;
}) {
  const socket = getSocket();
  const [badges, setBadges] = useState<BadgePayload | null>(null);
  const prevConversationIdRef = useRef<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    if (
      prevConversationIdRef.current &&
      prevConversationIdRef.current !== conversationId
    ) {
      socket.emit("conversation:leave", {
        conversationId: prevConversationIdRef.current,
      });
    }
    prevConversationIdRef.current = conversationId;

    socket.emit("conversation:join", { conversationId });

    const handleNew = (p: any) => {
      onNewMessage(p);
      if (!document.hidden) markReadDebounced();
    };
    const handleBadges = (p: BadgePayload) => setBadges(p);
    const handleVisibility = () => {
      if (!document.hidden) markReadDebounced();
    };
    socket.on("chat:newMessage", handleNew);
    socket.on("notif:badge", handleBadges);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.off("chat:newMessage", handleNew);
      socket.off("notif:badge", handleBadges);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [socket, conversationId, onNewMessage]);

  const markReadDebounced = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const lastId = getLastMessageId();
      if (!lastId) return;
      socket.emit("conversation:read", {
        conversationId,
        lastMessageId: lastId,
      });
    }, 200);
  };

  const send = (text: string, attachments?: any[]) => {
    socket.emit("conversation:send", { conversationId, text, attachments });
  };
  const unreadForThisChat = useMemo(
    () => badges?.byConversation?.[`external:${conversationId}`] ?? 0,
    [badges, conversationId]
  );

  return { send, markRead: markReadDebounced, unreadForThisChat };
}
