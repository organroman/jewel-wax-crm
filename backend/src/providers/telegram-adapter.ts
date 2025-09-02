import { InboundEvent, SendParams, SendResult } from "./../types/chat.types";

import { ProviderAdapter } from "./provider-adapter";
import { getSecret } from "../utils/helpers";

const API = (t: string, method: string) =>
  `https://api.telegram.org/bot${t}/${method}`;

export const telegramAdapter: ProviderAdapter = {
  async parseWebhook(req): Promise<InboundEvent[]> {
    const u = req.body; // Telegram Update
    const pulls: InboundEvent[] = [];

    const msg = u.message || u.edited_message || u.channel_post || null;
    if (!msg) return pulls;

    const isUser = !!msg.from?.id;
    if (!isUser) return pulls;

    const attachments: InboundEvent["attachments"] = [];
    if (msg.photo?.length) {
      const photo = msg.photo[msg.photo.length - 1]; // largest
      attachments.push({
        url: `tg:file_id:${photo.file_id}`,
        mime: "image/jpeg",
      });
    }
    if (msg.document) {
      attachments.push({
        url: `tg:file_id:${msg.document.file_id}`,
        mime: msg.document.mime_type,
        file_name: msg.document.file_name,
      });
    }

    pulls.push({
      provider: "telegram",
      channelExternalId: process.env.TELEGRAM_BOT_USERNAME || "telegram",
      conversationExternalId: String(msg.chat.id),
      contactExternalId: String(msg.from.id),
      contactUsername: msg.from.username,
      contactFullName:
        [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ") ||
        null,
      text: msg.text || msg.caption || null,
      attachments,
      externalMessageId: String(msg.message_id),
      sentAt: msg.date ? new Date(msg.date * 1000) : null,
      raw: {}, // keep tiny
    });

    return pulls;
  },

  async sendMessage(params: SendParams): Promise<SendResult> {
    // const token = channelSettings?.token || process.env.TG_BOT_TOKEN;
    const { channel, to, text, attachments = [] } = params;

    const token =
      (await getSecret(channel?.secret_ref)) || process.env.TG_BOT_TOKEN;
    if (!token) throw new Error("TG_BOT_TOKEN missing");
    const chat_id = to.external_id;

    const parts: NonNullable<SendResult["parts"]> = [];

    if (text?.trim()) {
      const resp = await fetch(API(token, "sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      const data = await resp.json();
      if (!data.ok) {
        throw Object.assign(
          new Error(data.description || "tg sendMessage failed"),
          {
            code: data.error_code,
            details: data,
          }
        );
      }
      parts.push({
        externalMessageId: String(data.result.message_id),
        kind: "text",
      });
    }

    for (const a of attachments) {
      const mime = a.mime || "";
      const isImage = mime.startsWith("image/");

      if (!isImage) {
        try {
          const res = await fetch(
            a.url.startsWith("tg:file_id:")
              ? a.url.replace("tg:file_id:", "")
              : a.url
          );
          const buf = await res.arrayBuffer();

          const file = new File([buf], a.name, {
            type: mime || "application/octet-stream",
          });
          const form = new FormData();
          form.set("chat_id", chat_id);
          form.set("document", file);

          const r2 = await fetch(API(token, "sendDocument"), {
            method: "POST",
            body: form as any,
          });
          const d2 = await r2.json();
          if (!d2.ok) {
            console.error("TG multipart sendDocument failed:", d2);
            parts.push({ externalMessageId: "", kind: "file" });
          } else {
            parts.push({
              externalMessageId: String(d2.result.message_id),
              kind: "file",
            });
          }
          continue; // done with this attachment
        } catch (e) {
          console.error("TG multipart threw:", e);
          parts.push({ externalMessageId: "", kind: "file" });
          continue;
        }
      }

      // Images: URL or file_id is fine (filename not shown in chat anyway)
      const value = a.url.startsWith("tg:file_id:")
        ? a.url.replace("tg:file_id:", "")
        : a.url;
      const payload: any = { chat_id, photo: value };
      if (a.name) payload.caption = a.name.slice(0, 1024);

      const r1 = await fetch(API(token, "sendPhoto"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d1 = await r1.json();
      if (!d1.ok) {
        console.warn("TG sendPhoto failed:", d1);
        parts.push({ externalMessageId: "", kind: "image" });
      } else {
        parts.push({
          externalMessageId: String(d1.result.message_id),
          kind: "image",
        });
      }
    }

    return {
      externalMessageId: parts[0]?.externalMessageId || null,
      parts,
    };
  },
};
