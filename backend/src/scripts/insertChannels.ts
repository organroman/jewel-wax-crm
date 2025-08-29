import db from "../db/db";

type Json = Record<string, unknown>;

type ChannelRow = {
  provider: string; // 'telegram' | 'whatsapp' | 'instagram' | 'facebook' | 'viber'
  account_label: string;
  external_account_id: string; // bot username, phone_id, page_id, ig_user_id, etc.
  is_active: boolean;
  settings: Json; // secret_ref, phone_id, ig_user_id, verify_header_secret, etc.
};

// tiny helpers
const bool = (v: string | undefined, def = false) =>
  v === undefined ? def : ["1", "true", "yes", "on"].includes(v.toLowerCase());

const clean = (obj: Json) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
export async function insertChannels() {
  const rows: ChannelRow[] = [];

  // === Telegram ===
  // Required: TELEGRAM_BOT_USERNAME
  // Optional: TELEGRAM_LABEL, TELEGRAM_SECRET_REF, TG_SECRET (header verify), TELEGRAM_ACTIVE
  if (process.env.TELEGRAM_BOT_USERNAME) {
    rows.push({
      provider: "telegram",
      account_label:
        process.env.TELEGRAM_LABEL ||
        `Telegram ${process.env.TELEGRAM_BOT_USERNAME}`,
      external_account_id: process.env.TELEGRAM_BOT_USERNAME,
      is_active: bool(process.env.TELEGRAM_ACTIVE, true),
      settings: clean({
        secret_ref: process.env.TELEGRAM_SECRET_REF, // e.g. "telegram/danit_support_bot"
        verify_header_secret: process.env.TG_SECRET, // matches setWebhook secret_token
        // ⚠️ do NOT put TG_BOT_TOKEN here; keep it in a secrets manager/env
      }),
    });
  }

  // === WhatsApp Cloud ===
  // Required: WA_PHONE_ID
  // Optional: WA_LABEL, WA_SECRET_REF, WHATSAPP_ACTIVE
  if (process.env.WA_PHONE_ID) {
    rows.push({
      provider: "whatsapp",
      account_label: process.env.WA_LABEL || "WhatsApp Business",
      external_account_id: process.env.WA_PHONE_ID, // phone number ID (not the E.164)
      is_active: bool(process.env.WHATSAPP_ACTIVE, true),
      settings: clean({
        phone_id: process.env.WA_PHONE_ID,
        secret_ref: process.env.WA_SECRET_REF, // e.g. "meta/wa/page_token"
      }),
    });
  }

  // === Instagram DM ===
  // Required: IG_USER_ID
  // Optional: IG_LABEL, IG_SECRET_REF, INSTAGRAM_ACTIVE
  if (process.env.IG_USER_ID) {
    rows.push({
      provider: "instagram",
      account_label: process.env.IG_LABEL || "Instagram Business",
      external_account_id: process.env.IG_USER_ID, // your IG business user id
      is_active: bool(process.env.INSTAGRAM_ACTIVE, true),
      settings: clean({
        ig_user_id: process.env.IG_USER_ID,
        secret_ref: process.env.IG_SECRET_REF, // e.g. "meta/ig/page_token"
      }),
    });
  }

  // === Facebook Messenger (Page) ===
  // Required: FB_PAGE_ID
  // Optional: FB_LABEL, FB_SECRET_REF, FACEBOOK_ACTIVE
  if (process.env.FB_PAGE_ID) {
    rows.push({
      provider: "facebook",
      account_label: process.env.FB_LABEL || "Facebook Page",
      external_account_id: process.env.FB_PAGE_ID, // page id
      is_active: bool(process.env.FACEBOOK_ACTIVE, true),
      settings: clean({
        page_id: process.env.FB_PAGE_ID,
        secret_ref: process.env.FB_SECRET_REF, // e.g. "meta/fb/page_token"
      }),
    });
  }

  // === Viber ===
  // Optional: VIBER_LABEL, VIBER_SECRET_REF, VIBER_ACTIVE
  // external_account_id can be a stable string like "viber-bot"
  if (process.env.VIBER_SECRET_REF) {
    rows.push({
      provider: "viber",
      account_label: process.env.VIBER_LABEL || "Viber Bot",
      external_account_id: process.env.VIBER_EXTERNAL_ID || "viber-bot",
      is_active: bool(process.env.VIBER_ACTIVE, true),
      settings: clean({
        secret_ref: process.env.VIBER_SECRET_REF, // e.g. "viber/danit_bot_token"
      }),
    });
  }

  if (!rows.length) {
    console.warn("[channels seed] No env provided; nothing to insert.");
    return;
  }

  for (const row of rows) {
    // Upsert by (provider, external_account_id)
    await db("channels")
      .insert({
        provider: row.provider,
        account_label: row.account_label,
        external_account_id: row.external_account_id,
        is_active: row.is_active,
        settings: row.settings,
      })
      .onConflict(["provider", "external_account_id"])
      .merge({
        account_label: row.account_label,
        is_active: row.is_active,
        settings: row.settings,
        updated_at: db.fn.now(),
      });
  }

  console.log(`[channels seed] Upserted ${rows.length} channel(s).`);
}

insertChannels();
