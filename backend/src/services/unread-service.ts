import { MessageModel } from "../models/chat/message-model";
import { OrderChatModel } from "../models/order-chat-model";

export async function computeBadges(personId: number) {
  const [ext, int] = await Promise.all([
    MessageModel.unreadByConversation(personId),
    OrderChatModel.unreadByChat(personId),
  ]);

  const byConversation: Record<string, number> = {};
  let total = 0;

  for (const r of ext) {
    const n = Number((r as any).unread || 0);
    byConversation[`external:${(r as any).conversation_id}`] = n;
    total += n;
  }

  for (const r of int) {
    const n = Number((r as any).unread || 0);
    byConversation[`internal:${(r as any).chat_id}`] = n;
    total += n;
  }

  return { total, byConversation };
}
