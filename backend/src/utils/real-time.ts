import { Server, Socket } from "socket.io";
import { computeBadges } from "../services/unread-service";

export async function getViewerUserIds(
  io: Server,
  room: string
): Promise<number[]> {
  const socketIds = await io.in(room).allSockets(); // Set<string>
  const viewers: number[] = [];
  for (const sid of socketIds) {
    const s: Socket | undefined = io.sockets.sockets.get(sid);
    const uid = s?.data?.user?.id;
    if (typeof uid === "number") viewers.push(uid);
  }
  // unique
  return [...new Set(viewers)];
}

/** emit unread badges (internal + external) to one user room */
export async function emitBadges(io: Server, personId: number) {
  const payload = await computeBadges(personId);
  io.to(`user:${personId}`).emit("notif:badge", {
    total: payload.total,
    byConversation: payload.byConversation,
  });
}
