import cloudinary from "../cloudinary/config";
import db from "../db/db";

const TG = (t: string, m: string) => `https://api.telegram.org/bot${t}/${m}`;

export async function fetchAndStoreTelegramAvatar({
  tgUserId,
  contactId,
  botToken,
  force = false,
}: {
  tgUserId: string | number;
  contactId: number;
  botToken: string;
  force?: boolean;
}) {
  // optional throttle: skip if we fetched recently and not forcing
  if (!force) {
    const c = await db("contacts")
      .select("avatar_url", "updated_at")
      .where({ id: contactId })
      .first();
    if (c?.avatar_url) return; // already have one; keep it simple
  }

  // 1) get profile photos
  const photosResp = await fetch(TG(botToken, "getUserProfilePhotos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: Number(tgUserId), limit: 1 }),
  }).then((r) => r.json());

  if (!photosResp?.ok || !photosResp.result?.total_count) return;

  // 2) pick largest size of first photo
  const sizes = photosResp.result.photos[0] as Array<{
    file_id: string;
    width: number;
    height: number;
  }>;
  const best = sizes.sort((a, b) => b.width * b.height - a.width * a.height)[0];

  // 3) resolve file_path
  const fileResp = await fetch(TG(botToken, "getFile"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: best.file_id }),
  }).then((r) => r.json());

  if (!fileResp?.ok || !fileResp.result?.file_path) return;

  const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileResp.result.file_path}`;

  // 4) rehost (Telegram links expire)
  const up = await cloudinary.uploader.upload(fileUrl, {
    folder: "avatars/telegram",
    public_id: `tg_${tgUserId}`,
    overwrite: true,
    resource_type: "image",
  });

  // 5) save
  await db("contacts")
    .where({ id: contactId })
    .update({ avatar_url: up.secure_url });
}
