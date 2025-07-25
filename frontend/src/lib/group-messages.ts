import { ChatMessage } from "@/types/order-chat.types";
import { format, isToday, isYesterday, Locale } from "date-fns";

export function groupMessagesByDate(
  messages: ChatMessage[],
  locale: Locale,
  t: (text: string) => string
) {
  const grouped: Record<string, ChatMessage[]> = {};


  messages.forEach((msg) => {
    const date = new Date(msg.created_at);

    let dateKey = format(date, "d MMMM yyyy", { locale });
    if (isToday(date)) {
      dateKey = t("dictionary.today");
    } else if (isYesterday(date)) {
      dateKey = t("dictionary.yesterday");
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(msg);
  });
  return grouped;
}
