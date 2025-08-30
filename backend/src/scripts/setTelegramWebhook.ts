import db from "../db/db";

import { getSecret } from "../utils/helpers";

type ChannelRow = {
  id: number;
  provider: string;
  external_account_id: string | null;
  settings: {
    secret_ref?: string;
    verify_header_secret?: string;
  } | null;
};

const TG_API = (t: string, m: string) =>
  `https://api.telegram.org/bot${t}/${m}`;

async function main() {
  const webhookUrl =
    process.env.TELEGRAM_WEBHOOK_URL ||
    "https://test-crm.jewel-wax.com.ua/api/chat/webhooks/telegram";

  const url = webhookUrl;

  if (!url) {
    throw new Error(
      "Missing TELEGRAM_WEBHOOK_URL or APP_BASE_URL (+ optional TELEGRAM_WEBHOOK_PATH)"
    );
  }

  const rows: ChannelRow[] = await db<ChannelRow>("channels")
    .select("id", "provider", "external_account_id", "settings")
    .where("provider", "telegram");

  if (!rows.length) {
    console.log("No telegram channels found — skipping setWebhook");
    return;
  }

  for (const ch of rows) {
    const secretRef = ch.settings?.secret_ref;
    const headerSecret = ch.settings?.verify_header_secret; // used by your webhook auth
    const token =
      (secretRef ? await getSecret(secretRef) : undefined) ||
      process.env.TG_BOT_TOKEN;

    if (!token) {
      console.warn(
        `⚠️  Channel ${ch.id}: no token (secret_ref missing/invalid and TG_BOT_TOKEN not set) — skipping`
      );
      continue;
    }

    const body = {
      url, // e.g. https://crm.yourdomain.com/chat/webhooks/telegram
      secret_token: headerSecret || undefined, // Telegram will echo in header
      drop_pending_updates: false,
      allowed_updates: ["message", "edited_message", "callback_query"],
      max_connections: 40,
    };

    const resp = await fetch(TG_API(token, "setWebhook"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!data.ok) {
      console.error(`❌ setWebhook failed for channel ${ch.id}`, data);
    } else {
      console.log(
        `✅ setWebhook ok for channel ${ch.id} → ${url} (has_secret=${
          headerSecret ? "yes" : "no"
        })`
      );
    }

    const info = await fetch(TG_API(token, "getWebhookInfo")).then((r) =>
      r.json()
    );
    console.log("WebhookInfo:", info);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
