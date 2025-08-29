import db from "../db/db";
import type { InboundEvent } from "../types/chat.types";
import { getSecret } from "../utils/helpers"; // SECRET__ref -> token

type ResolvedAttachment = {
  buffer: Buffer;
  mimetype: string;
  filename: string;
  byteSize: number;
  width?: number | null; // fill if you want (optional)
  height?: number | null;
  durationMs?: number | null;
  extra?: Record<string, unknown>;
};

const isTgFileId = (u?: string | null) => !!u && u.startsWith("tg:file_id:");
const tgApi = (t: string, m: string) => `https://api.telegram.org/bot${t}/${m}`;
const tgFile = (t: string, p: string) =>
  `https://api.telegram.org/file/bot${t}/${p}`;

async function fetchAsBuffer(url: string, headers?: Record<string, string>) {
  const resp = await fetch(url, { headers });
  if (!resp.ok)
    throw new Error(`download failed ${resp.status}: ${await resp.text()}`);
  const ab = await resp.arrayBuffer();
  return Buffer.from(ab);
}

/**
 * Resolve all event attachments to raw files (Buffers) ready for UploadService.
 * - Telegram: file_id -> getFile -> download
 * - Generic http(s) links: download as-is (optionally add auth headers per provider)
 */
export async function resolveAttachmentsForEvent(
  ev: InboundEvent
): Promise<ResolvedAttachment[]> {
  const out: ResolvedAttachment[] = [];
  if (!ev.attachments?.length) return out;

  // NOTE: some providers (Meta) give expiring links + need tokens. Add per-provider headers if needed.
  const provider = ev.provider;

  if (provider === "telegram") {
    // Need channel to get bot token
    // You already looked up Channel in ChatService; but here we only have channelExternalId.
    // If you prefer, pass the Channel object into this function instead of re-querying.
    const ch = await db("channels")
      .where({
        provider: "telegram",
        external_account_id: ev.channelExternalId,
      })
      .first(["settings"]);

    const token =
      (await getSecret(ch?.settings?.secret_ref)) || process.env.TG_BOT_TOKEN;
    if (!token) throw new Error("Telegram token missing");

    for (const a of ev.attachments) {
      if (!isTgFileId(a.url)) continue;
      const fileId = a.url!.slice("tg:file_id:".length);

      // 1) getFile -> file_path
      const metaResp = await fetch(
        tgApi(token, "getFile") + `?file_id=${encodeURIComponent(fileId)}`
      );
      const meta = await metaResp.json();
      if (!meta.ok) throw new Error(`getFile failed: ${JSON.stringify(meta)}`);
      const filePath: string = meta.result.file_path;

      // 2) download
      const buf = await fetchAsBuffer(tgFile(token, filePath));

      //   3) basic name/mime (Telegram doesn't always send)
      const filename =
        a.file_name ?? filePath.split("/").pop() ?? `tg_${fileId}`;
      const mimetype =
        a.mime ??
        (filename.includes(".")
          ? `image/${filename.split(".").pop()}`
          : "application/octet-stream");

      out.push({
        buffer: buf,
        mimetype,
        filename,
        byteSize: buf.length,
        width: a.width ?? null,
        height: a.height ?? null,
        durationMs: a.duration_ms ?? null,
        extra: {
          source: "telegram",
          tg_file_id: fileId,
          tg_file_path: filePath,
        },
      });
    }
    return out;
  }

  // default: try to download by URL (e.g., WhatsApp/FB/IG links or already-public)
  // Add provider-specific headers here if links require auth.
  for (const a of ev.attachments) {
    if (!a.url) continue;
    const buf = await fetchAsBuffer(a.url);
    out.push({
      buffer: buf,
      mimetype: a.mime || "application/octet-stream",
      filename: a.file_name || "file",
      byteSize: buf.length,
      width: a.width ?? undefined,
      height: a.height ?? undefined,
      durationMs: a.duration_ms ?? undefined,
      extra: a.extra || {},
    });
  }

  return out;
}

export type MulterLikeFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export function toMulterFiles(
  resolved: ResolvedAttachment[]
): MulterLikeFile[] {
  return resolved.map((r, i) => ({
    fieldname: "file",
    originalname: r.filename,
    encoding: "7bit",
    mimetype: r.mimetype,
    size: r.byteSize,
    buffer: r.buffer,
  }));
}
