import { RefreshTokenRecord } from "../types/auth.types";
import db from "../db/db";

export const AuthModel = {
  async createRefreshToken(personId: string, refresh_token: string, expiresAt: Date) {
    await db("refresh_tokens").insert({
      person_id: personId,
      token: refresh_token,
      expires_at: expiresAt,
    });
  },
  async findValidRefreshToken(token: string): Promise<RefreshTokenRecord> {
    return db("refresh_tokens")
      .where({ token, is_valid: true })
      .andWhere("expires_at", ">", new Date())
      .first();
  },
  async invalidateRefreshToken(token: string) {
    await db("refresh_tokens").where({ token }).update({ is_valid: false });
  },
  async invalidateAllTokensForUser(personId: number) {
    await db("refresh_tokens")
      .where({ person_id: personId })
      .update({ is_valid: false });
  },
};
